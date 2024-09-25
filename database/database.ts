import { openDatabaseAsync } from 'expo-sqlite';
import { SQLRunResult, SQLRow, SQLRows } from './types';
import {FrequencyType} from "@/types";

// Open or create the database asynchronously
const openDb = async () => {
    return await openDatabaseAsync('chores.db');
};

// should be able to delete this function once its working for sure
export const migrateAddFrequencyType = async (): Promise<void> => {
    const db = await openDb();
    // Check if frequency_type column exists
    const result = await db.getFirstAsync(`
        PRAGMA table_info(chores);
    `);

    const columns = await db.getAllAsync(`
        PRAGMA table_info(chores);
    `);

    const hasFrequencyType = columns.some((column: any) => column.name === 'frequency_type');

    if (!hasFrequencyType) {
        await db.execAsync(`
            ALTER TABLE chores ADD COLUMN frequency_type TEXT NOT NULL DEFAULT 'day';
        `);
    }
};

// Function to create the necessary tables
export const createTables = async (): Promise<void> => {
    const db = await openDb();

    await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS chores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      instructions TEXT,  -- JSON array to store ordered list of strings
      items_needed TEXT,  -- JSON array to store array of strings
      status TEXT DEFAULT 'active', -- active or not
      frequency INTEGER NOT NULL, -- number of days between completions
      importance INTEGER DEFAULT 0 -- integer importance level
    );

    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chore_id INTEGER NOT NULL,
      date_completed INTEGER NOT NULL,
      FOREIGN KEY (chore_id) REFERENCES chores (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS chore_tags (
      chore_id INTEGER,
      tag_id INTEGER,
      FOREIGN KEY (chore_id) REFERENCES chores (id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
      PRIMARY KEY (chore_id, tag_id)
    );

    CREATE INDEX IF NOT EXISTS idx_chores_frequency ON chores(frequency);
    CREATE INDEX IF NOT EXISTS idx_chores_importance ON chores(importance);
    CREATE INDEX IF NOT EXISTS idx_entries_date_completed ON entries(date_completed);
    CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
    CREATE INDEX IF NOT EXISTS idx_chore_tags_chore_id ON chore_tags(chore_id);
    CREATE INDEX IF NOT EXISTS idx_chore_tags_tag_id ON chore_tags(tag_id);
  `);
};

// Function to retrieve chores with advanced sorting and filtering
export const getFilteredSortedChores = async (
    sortBy: 'days_left' | 'importance' | 'name',
    sortOrder: 'ASC' | 'DESC',
    tagIds: number[] = [],
    minImportance: number = 0,
    maxImportance: number = Infinity,
    nameFilter: string = ''
): Promise<SQLRows> => {
    const db = await openDb();

    let query = `
        SELECT c.*, IFNULL(MAX(e.date_completed), 0) AS last_completed,
            julianday(
                CASE
                    WHEN c.frequency_type = 'day' THEN datetime(IFNULL(MAX(e.date_completed), 0), 'unixepoch', '+' || c.frequency || ' day')
                    WHEN c.frequency_type = 'week' THEN datetime(IFNULL(MAX(e.date_completed), 0), 'unixepoch', '+' || (c.frequency * 7) || ' day')
                    WHEN c.frequency_type = 'month' THEN datetime(IFNULL(MAX(e.date_completed), 0), 'unixepoch', '+' || c.frequency || ' month')
                    WHEN c.frequency_type = 'year' THEN datetime(IFNULL(MAX(e.date_completed), 0), 'unixepoch', '+' || c.frequency || ' year')
                    ELSE datetime(IFNULL(MAX(e.date_completed), 0), 'unixepoch')
                END
            ) - julianday('now') AS days_left
        FROM chores c
        LEFT JOIN entries e ON c.id = e.chore_id
        LEFT JOIN chore_tags ct ON c.id = ct.chore_id
        WHERE c.importance BETWEEN ? AND ?
    `;

    const params: (number | string)[] = [minImportance, maxImportance];

    if (tagIds.length > 0) {
        const placeholders = tagIds.map(() => '?').join(',');
        query += ` AND ct.tag_id IN (${placeholders})`;
        params.push(...tagIds);
    }

    if (nameFilter) {
        query += ` AND c.name LIKE ?`;
        params.push(`%${nameFilter}%`);
    }

    query += `
        GROUP BY c.id
        ORDER BY 
            ${sortBy === 'days_left' ? 'days_left' : `c.${sortBy}`} ${sortOrder},
            c.importance ${sortOrder},
            c.name ${sortOrder};
    `;

    return await db.getAllAsync(query, ...params);
};


// Function to insert a new chore with tags
export const insertChoreWithTags = async (
    name: string,
    description: string,
    instructions: string[],
    itemsNeeded: string[],
    frequency: number,
    frequencyType: FrequencyType = 'day',
    status: string = 'active',
    importance: number = 0,
    tagIds: number[] = []
): Promise<SQLRunResult> => {
    const db = await openDb();

    const result: SQLRunResult = await db.runAsync(
        'INSERT INTO chores (name, description, instructions, items_needed, status, frequency, frequency_type, importance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        name,
        description,
        JSON.stringify(instructions),
        JSON.stringify(itemsNeeded),
        status,
        frequency,
        frequencyType,
        importance
    );

    if (tagIds.length > 0) {
        for (const tagId of tagIds) {
            await addTagToChore(result.lastInsertRowId!, tagId);
        }
    }

    return result;
};

// Function to retrieve all chores
export const getAllChores = async (): Promise<SQLRows> => {
    const db = await openDb();
    return await db.getAllAsync('SELECT * FROM chores');
};


// Function to retrieve a single chore
export const getFirstChore = async (id: number): Promise<SQLRow | null> => {
    const db = await openDb();
    return await db.getFirstAsync('SELECT * FROM chores WHERE id = ?', id);
};

// Function to update a chore
export const updateChore = async (
    id: number,
    name: string,
    description: string,
    instructions: string[],
    itemsNeeded: string[],
    status: string,
    frequency: number,
    frequencyType: FrequencyType,
    importance: number
): Promise<void> => {
    const db = await openDb();

    await db.runAsync(
        'UPDATE chores SET name = ?, description = ?, instructions = ?, items_needed = ?, status = ?, frequency = ?, frequency_type = ?, importance = ? WHERE id = ?',
        name,
        description,
        JSON.stringify(instructions),
        JSON.stringify(itemsNeeded),
        status,
        frequency,
        frequencyType,
        importance,
        id
    );
};


// Function to delete a chore
export const deleteChore = async (id: number): Promise<void> => {
    const db = await openDb();
    await db.runAsync('DELETE FROM chores WHERE id = ?', id);
};

// Function to insert a new entry for a chore
export const insertEntry = async (choreId: number, dateCompleted: number): Promise<SQLRunResult> => {
    const db = await openDb();
    return await db.runAsync(
        'INSERT INTO entries (chore_id, date_completed) VALUES (?, ?)',
        choreId, dateCompleted
    );
};

// Function to get all entries for a specific chore
export const getEntriesForChore = async (choreId: number): Promise<SQLRows> => {
    const db = await openDb();
    return await db.getAllAsync('SELECT * FROM entries WHERE chore_id = ?', choreId);
};

// Function to delete all entries for a chore
export const deleteEntriesForChore = async (choreId: number): Promise<void> => {
    const db = await openDb();
    await db.runAsync('DELETE FROM entries WHERE chore_id = ?', choreId);
};

// Function to get all tags
export const getAllTags = async (): Promise<SQLRows> => {
    const db = await openDb();
    return await db.getAllAsync('SELECT * FROM tags');
};

// Function to get a tag by name
export const getTagByName = async (name: string): Promise<SQLRow | null> => {
    const db = await openDb();
    return await db.getFirstAsync('SELECT * FROM tags WHERE name = ?', name);
};

// Function to create a new tag
export const createTag = async (name: string): Promise<SQLRunResult> => {
    const db = await openDb();
    console.log("Creating Tag: ", name);
    return await db.runAsync('INSERT INTO tags (name) VALUES (?)', name);
};

// Function to update a tag
export const updateTag = async (id: number, name: string): Promise<void> => {
    const db = await openDb();
    await db.runAsync('UPDATE tags SET name = ? WHERE id = ?', name, id);
};

// Function to delete a tag
export const deleteTag = async (id: number): Promise<void> => {
    const db = await openDb();
    await db.runAsync('DELETE FROM tags WHERE id = ?', id);
};

// Function to add a tag to a chore
export const addTagToChore = async (choreId: number, tagId: number): Promise<void> => {
    const db = await openDb();
    await db.runAsync('INSERT INTO chore_tags (chore_id, tag_id) VALUES (?, ?)', choreId, tagId);
};

// Function to update tags for a chore
export const updateTagsForChore = async (choreId: number, newTagIds: number[]): Promise<void> => {
    const db = await openDb();
    await db.runAsync('DELETE FROM chore_tags WHERE chore_id = ?', choreId);

    for (const tagId of newTagIds) {
        await addTagToChore(choreId, tagId);
    }
};

// Function to remove a tag from a chore
export const removeTagFromChore = async (choreId: number, tagId: number): Promise<void> => {
    const db = await openDb();
    await db.runAsync('DELETE FROM chore_tags WHERE chore_id = ? AND tag_id = ?', choreId, tagId);
};

// Function to delete all tags for a chore
export const deleteTagsForChore = async (choreId: number): Promise<void> => {
    const db = await openDb();
    await db.runAsync('DELETE FROM chore_tags WHERE chore_id = ?', choreId);
};
