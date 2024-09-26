/*
// database.ts

import { Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from "expo-sqlite";
import {Chore, FrequencyType, Tag} from "@/types"; // Ensure you're using a version that supports async methods

export interface SQLRunResult {
    lastInsertRowId?: number; // The ID of the last inserted row (if applicable)
    changes: number; // Number of rows affected by the query
}

export interface SQLRow {
    [column: string]: any;
}

export type SQLRows = SQLRow[];

/!* ============================
   === Execution Helpers =======
   ============================ *!/

/!**
 * Executes a single SQL statement with parameters asynchronously.
 * @param db The SQLite database instance.
 * @param sql The SQL query string.
 * @param params The parameters for the SQL query.
 * @returns The result of the SQL execution.
 *!/
export const runAsync = async (
    db: SQLiteDatabase,
    sql: string,
    params: any[] = []
): Promise<SQLRunResult> => {
    try {
        const result = await db.runAsync(sql, params);
        console.log(`Executed SQL: ${sql} with params: ${JSON.stringify(params)}`);
        return result;
    } catch (error) {
        console.error(`Error executing SQL: ${sql} with params: ${JSON.stringify(params)} -`, error);
        throw error;
    }
};

/!**
 * Executes multiple SQL statements asynchronously.
 * @param db The SQLite database instance.
 * @param sql The SQL query string containing multiple statements.
 *!/
export const execAsync = async (
    db: SQLiteDatabase,
    sql: string
): Promise<void> => {
    try {
        await db.execAsync(sql);
        console.log(`Executed SQL commands: ${sql}`);
    } catch (error) {
        console.error(`Error executing SQL commands: ${sql} -`, error);
        throw error;
    }
};

/!* ============================
   === Table Creation Scripts ==
   ============================ *!/

/!**
 * Creates necessary tables for Chores and Notes.
 * @param db The SQLite database instance.
 *!/
export const createTables = async (db: SQLiteDatabase): Promise<void> => {
    try {
        await execAsync(db, `
            PRAGMA journal_mode = WAL;

            /!* Chores Tables *!/
            CREATE TABLE IF NOT EXISTS chores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                frequency INTEGER,
                frequencyType TEXT DEFAULT 'day',
                status TEXT DEFAULT 'active',
                importance INTEGER
            );

            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS chore_tags (
                chore_id INTEGER,
                tag_id INTEGER,
                FOREIGN KEY(chore_id) REFERENCES chores(id) ON DELETE CASCADE,
                FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE,
                PRIMARY KEY (chore_id, tag_id)
            );

            CREATE TABLE IF NOT EXISTS instructions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chore_id INTEGER,
                text TEXT,
                FOREIGN KEY(chore_id) REFERENCES chores(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS items_needed (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chore_id INTEGER,
                text TEXT,
                FOREIGN KEY(chore_id) REFERENCES chores(id) ON DELETE CASCADE
            );

            /!* Notes Tables *!/
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                status TEXT DEFAULT 'active'
            );

            CREATE TABLE IF NOT EXISTS note_tags (
                note_id INTEGER,
                tag_id INTEGER,
                FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
                PRIMARY KEY (note_id, tag_id)
            );

            /!* Indexes for Performance *!/
            CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
            CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
            CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
            CREATE INDEX IF NOT EXISTS idx_chore_tags_chore_id ON chore_tags(chore_id);
            CREATE INDEX IF NOT EXISTS idx_chore_tags_tag_id ON chore_tags(tag_id);
            CREATE INDEX IF NOT EXISTS idx_note_tags_note_id ON note_tags(note_id);
            CREATE INDEX IF NOT EXISTS idx_note_tags_tag_id ON note_tags(tag_id);
        `);
        console.log("All tables created successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
        Alert.alert("Database Error", "Failed to create tables.");
        throw error;
    }
};

/!* ============================
   === Migration Functions ===
   ============================ *!/

/!**
 * Migration to add 'frequencyType' column to 'chores' table if it doesn't exist.
 * @param db The SQLite database instance.
 *!/
export const migrateAddFrequencyType = async (db: SQLiteDatabase): Promise<void> => {
    try {
        await runAsync(db, `ALTER TABLE chores ADD COLUMN frequencyType TEXT DEFAULT 'day';`);
        console.log("'frequencyType' column added successfully to chores.");
    } catch (error: any) {
        if (error.message.includes("duplicate column name") || error.message.includes("duplicate column")) {
            // Column already exists, safe to ignore
            console.log("'frequencyType' column already exists in chores.");
        } else {
            console.error("Error adding 'frequencyType' column to chores:", error);
            Alert.alert("Database Error", "Failed to add 'frequencyType' column to chores.");
            throw error;
        }
    }
};

/!* ============================
   === Chores Functions ========
   ============================ *!/

/!**
 * Inserts a new chore with associated instructions, items needed, and tags.
 * @param db The SQLite database instance.
 * @param name The name of the chore.
 * @param description The description of the chore.
 * @param instructions An array of instruction texts.
 * @param itemsNeeded An array of items needed texts.
 * @param frequency The frequency value.
 * @param frequencyType The type of frequency ('day', 'week', 'month').
 * @param status The status of the chore.
 * @param importance The importance level of the chore.
 * @param tagIds An array of tag IDs to associate with the chore.
 * @returns The result of the insert operation.
 *!/
export const insertChoreWithTags = async (
    db: SQLiteDatabase,
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
    try {
        console.log("Inserting chore:", { name, description, frequency, frequencyType, status, importance, tagIds });

        // Insert into 'chores' table
        const choreResult = await runAsync(
            db,
            `INSERT INTO chores (name, description, frequency, frequencyType, status, importance) VALUES (?, ?, ?, ?, ?, ?);`,
            [name, description, frequency, frequencyType, status, importance]
        );
        const choreId = choreResult.lastInsertRowId;
        if (!choreId) {
            throw new Error("Failed to retrieve the inserted chore ID.");
        }
        console.log("Chore inserted with ID:", choreId);

        // Insert instructions
        for (const instruction of instructions) {
            console.log("Inserting instruction:", instruction);
            await runAsync(
                db,
                `INSERT INTO instructions (chore_id, text) VALUES (?, ?);`,
                [choreId, instruction]
            );
        }

        // Insert items needed
        for (const item of itemsNeeded) {
            console.log("Inserting item needed:", item);
            await runAsync(
                db,
                `INSERT INTO items_needed (chore_id, text) VALUES (?, ?);`,
                [choreId, item]
            );
        }

        // Insert into 'chore_tags'
        for (const tagId of tagIds) {
            console.log("Associating tag ID:", tagId, "with chore ID:", choreId);
            await runAsync(
                db,
                `INSERT INTO chore_tags (chore_id, tag_id) VALUES (?, ?);`,
                [choreId, tagId]
            );
        }

        console.log("Chore and associated data inserted successfully.");
        return { lastInsertRowId: choreId, changes: choreResult.changes };
    } catch (error: any) {
        console.error("Error inserting chore with tags:", error);
        Alert.alert("Database Error", "Failed to insert chore.");
        throw error;
    }
};

/!**
 * Retrieves all chores from the database.
 * @param db The SQLite database instance.
 * @returns An array of chores.
 *!/
// database.ts


export const getAllChores = async (db: SQLiteDatabase): Promise<Chore[]> => {
    try {
        const chores: SQLRow[] = await db.getAllAsync(
            `
                SELECT
                    chores.id,
                    chores.name,
                    chores.description,
                    chores.frequency,
                    chores.frequencyType,
                    chores.status,
                    chores.importance,
                    GROUP_CONCAT(DISTINCT instructions.text) AS instructions,
                    GROUP_CONCAT(DISTINCT items_needed.text) AS items_needed
                FROM chores
                         LEFT JOIN instructions ON chores.id = instructions.chore_id
                         LEFT JOIN items_needed ON chores.id = items_needed.chore_id
                GROUP BY chores.id
                ORDER BY chores.id ASC
            `,
            []
        );
        console.log("Fetched chores with instructions and items needed:", chores);

        const choreList: Chore[] = chores.map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            frequency: row.frequency,
            frequencyType: row.frequencyType as FrequencyType,
            status: row.status,
            importance: row.importance,
            instructions: row.instructions ? row.instructions.split('||') : [],
            items_needed: row.items_needed ? row.items_needed.split('||') : [],
        }));

        return choreList;
    } catch (error) {
        console.error("Error fetching chores with instructions and items needed:", error);
        Alert.alert("Database Error", "Failed to fetch chores.");
        throw error;
    }
};


/!**
 * Retrieves a single chore by its ID.
 * @param db The SQLite database instance.
 * @param id The ID of the chore.
 * @returns The chore object or null if not found.
 *!/
export const getChoreById = async (db: SQLiteDatabase, id: number): Promise<SQLRow | null> => {
    try {
        const chore: SQLRow | null = await db.getFirstAsync(
            `SELECT * FROM chores WHERE id = ?;`,
            [id]
        );
        console.log(`Fetched chore with ID ${id}:`, chore);
        return chore;
    } catch (error) {
        console.error(`Error fetching chore with ID ${id}:`, error);
        Alert.alert("Database Error", "Failed to fetch chore.");
        throw error;
    }
};

/!**
 * Updates a chore's details.
 * @param db The SQLite database instance.
 * @param id The ID of the chore to update.
 * @param updatedFields An object containing the fields to update.
 *!/
export const updateChore = async (
    db: SQLiteDatabase,
    id: number,
    updatedFields: {
        name?: string;
        description?: string;
        frequency?: number;
        frequencyType?: FrequencyType;
        status?: string;
        importance?: number;
    }
): Promise<void> => {
    try {
        const fields = [];
        const params: any[] = [];

        if (updatedFields.name !== undefined) {
            fields.push("name = ?");
            params.push(updatedFields.name);
        }
        if (updatedFields.description !== undefined) {
            fields.push("description = ?");
            params.push(updatedFields.description);
        }
        if (updatedFields.frequency !== undefined) {
            fields.push("frequency = ?");
            params.push(updatedFields.frequency);
        }
        if (updatedFields.frequencyType !== undefined) {
            fields.push("frequencyType = ?");
            params.push(updatedFields.frequencyType);
        }
        if (updatedFields.status !== undefined) {
            fields.push("status = ?");
            params.push(updatedFields.status);
        }
        if (updatedFields.importance !== undefined) {
            fields.push("importance = ?");
            params.push(updatedFields.importance);
        }

        if (fields.length === 0) {
            console.log("No fields to update for chore ID:", id);
            return;
        }

        params.push(id);

        const sql = `UPDATE chores SET ${fields.join(', ')} WHERE id = ?;`;

        await runAsync(db, sql, params);
        console.log(`Chore with ID ${id} updated successfully.`);
    } catch (error) {
        console.error(`Error updating chore with ID ${id}:`, error);
        Alert.alert("Database Error", "Failed to update chore.");
        throw error;
    }
};

/!**
 * Deletes a chore by its ID.
 * @param db The SQLite database instance.
 * @param id The ID of the chore to delete.
 *!/
export const deleteChore = async (db: SQLiteDatabase, id: number): Promise<void> => {
    try {
        await runAsync(db, 'DELETE FROM chores WHERE id = ?;', [id]);
        console.log(`Chore with ID ${id} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting chore with ID ${id}:`, error);
        Alert.alert("Database Error", "Failed to delete chore.");
        throw error;
    }
};

/!* ============================
   === Tags Functions =========
   ============================ *!/

/!**
 * Retrieves all tags from the 'tags' table.
 * @param db The SQLite database instance.
 * @returns An array of tags.
 *!/
export const getAllTags = async (db: SQLiteDatabase): Promise<Tag[]> => {
    try {
        const tagsResult: Tag[] = await db.getAllAsync(
            `SELECT * FROM tags;`,
            []
        );
        console.log("Fetched tags:", tagsResult);
        return tagsResult;
    } catch (error) {
        console.error("Error fetching tags:", error);
        Alert.alert("Database Error", "Failed to fetch tags.");
        throw error;
    }
};

/!**
 * Retrieves a tag by its name.
 * @param db The SQLite database instance.
 * @param name The name of the tag to retrieve.
 * @returns The tag object or null if not found.
 *!/
export const getTagByName = async (db: SQLiteDatabase, name: string): Promise<SQLRow | null> => {
    try {
        const tag: SQLRow | null = await db.getFirstAsync(
            'SELECT * FROM tags WHERE name = ?;',
            [name]
        );
        console.log(`Fetched tag with name '${name}':`, tag);
        return tag;
    } catch (error) {
        console.error(`Error fetching tag with name '${name}':`, error);
        Alert.alert("Database Error", "Failed to fetch tag.");
        throw error;
    }
};

/!**
 * Creates a new tag.
 * @param db The SQLite database instance.
 * @param name The name of the tag to create.
 * @returns The result of the insert operation.
 *!/
export const createTag = async (db: SQLiteDatabase, name: string): Promise<SQLRunResult> => {
    try {
        const result: SQLRunResult = await runAsync(
            db,
            'INSERT INTO tags (name) VALUES (?);',
            [name]
        );
        console.log(`Tag '${name}' created with ID: ${result.lastInsertRowId}`);
        return result;
    } catch (error) {
        console.error(`Error creating tag '${name}':`, error);
        Alert.alert("Database Error", "Failed to create tag.");
        throw error;
    }
};

/!**
 * Updates a tag's name.
 * @param db The SQLite database instance.
 * @param id The ID of the tag to update.
 * @param name The new name for the tag.
 *!/
export const updateTag = async (db: SQLiteDatabase, id: number, name: string): Promise<void> => {
    try {
        await runAsync(
            db,
            'UPDATE tags SET name = ? WHERE id = ?;',
            [name, id]
        );
        console.log(`Tag with ID ${id} updated to name '${name}'.`);
    } catch (error) {
        console.error(`Error updating tag with ID ${id}:`, error);
        Alert.alert("Database Error", "Failed to update tag.");
        throw error;
    }
};

/!**
 * Deletes a tag by its ID.
 * @param db The SQLite database instance.
 * @param id The ID of the tag to delete.
 *!/
export const deleteTag = async (db: SQLiteDatabase, id: number): Promise<void> => {
    try {
        await runAsync(db, 'DELETE FROM tags WHERE id = ?;', [id]);
        console.log(`Tag with ID ${id} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting tag with ID ${id}:`, error);
        Alert.alert("Database Error", "Failed to delete tag.");
        throw error;
    }
};

/!* ============================
   === Chore-Tags Association ==
   ============================ *!/

/!**
 * Adds a tag to a chore.
 * @param db The SQLite database instance.
 * @param choreId The ID of the chore.
 * @param tagId The ID of the tag to associate.
 *!/
export const addTagToChore = async (db: SQLiteDatabase, choreId: number, tagId: number): Promise<void> => {
    try {
        await runAsync(
            db,
            'INSERT INTO chore_tags (chore_id, tag_id) VALUES (?, ?);',
            [choreId, tagId]
        );
        console.log(`Tag ID ${tagId} associated with Chore ID ${choreId}.`);
    } catch (error) {
        console.error(`Error associating Tag ID ${tagId} with Chore ID ${choreId}:`, error);
        Alert.alert("Database Error", "Failed to associate tag with chore.");
        throw error;
    }
};

/!**
 * Removes a tag from a chore.
 * @param db The SQLite database instance.
 * @param choreId The ID of the chore.
 * @param tagId The ID of the tag to remove.
 *!/
export const removeTagFromChore = async (db: SQLiteDatabase, choreId: number, tagId: number): Promise<void> => {
    try {
        await runAsync(
            db,
            'DELETE FROM chore_tags WHERE chore_id = ? AND tag_id = ?;',
            [choreId, tagId]
        );
        console.log(`Tag ID ${tagId} removed from Chore ID ${choreId}.`);
    } catch (error) {
        console.error(`Error removing Tag ID ${tagId} from Chore ID ${choreId}:`, error);
        Alert.alert("Database Error", "Failed to remove tag from chore.");
        throw error;
    }
};

/!**
 * Updates tags for a chore by replacing existing tags with new ones.
 * @param db The SQLite database instance.
 * @param choreId The ID of the chore.
 * @param newTagIds An array of new tag IDs to associate with the chore.
 *!/
export const updateTagsForChore = async (db: SQLiteDatabase, choreId: number, newTagIds: number[]): Promise<void> => {
    try {
        // First, remove all existing tags for the chore
        await runAsync(db, 'DELETE FROM chore_tags WHERE chore_id = ?;', [choreId]);
        console.log(`All existing tags removed from Chore ID ${choreId}.`);

        // Add the new tags using parameterized queries
        for (const tagId of newTagIds) {
            await addTagToChore(db, choreId, tagId);
        }

        console.log(`Tags updated for Chore ID ${choreId}.`);
    } catch (error) {
        console.error(`Error updating tags for Chore ID ${choreId}:`, error);
        Alert.alert("Database Error", "Failed to update chore tags.");
        throw error;
    }
};

/!* ============================
   === Note-Tags Association ==
   ============================ *!/

/!**
 * Adds a tag to a note.
 * @param db The SQLite database instance.
 * @param noteId The ID of the note.
 * @param tagId The ID of the tag to associate.
 *!/
export const addTagToNote = async (db: SQLiteDatabase, noteId: number, tagId: number): Promise<void> => {
    try {
        await runAsync(
            db,
            'INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?);',
            [noteId, tagId]
        );
        console.log(`Tag ID ${tagId} associated with Note ID ${noteId}.`);
    } catch (error) {
        console.error(`Error associating Tag ID ${tagId} with Note ID ${noteId}:`, error);
        Alert.alert("Database Error", "Failed to associate tag with note.");
        throw error;
    }
};

/!**
 * Removes a tag from a note.
 * @param db The SQLite database instance.
 * @param noteId The ID of the note.
 * @param tagId The ID of the tag to remove.
 *!/
export const removeTagFromNote = async (db: SQLiteDatabase, noteId: number, tagId: number): Promise<void> => {
    try {
        await runAsync(
            db,
            'DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?;',
            [noteId, tagId]
        );
        console.log(`Tag ID ${tagId} removed from Note ID ${noteId}.`);
    } catch (error) {
        console.error(`Error removing Tag ID ${tagId} from Note ID ${noteId}:`, error);
        Alert.alert("Database Error", "Failed to remove tag from note.");
        throw error;
    }
};

/!**
 * Updates tags for a note by replacing existing tags with new ones.
 * @param db The SQLite database instance.
 * @param noteId The ID of the note.
 * @param newTagIds An array of new tag IDs to associate with the note.
 *!/
export const updateTagsForNote = async (db: SQLiteDatabase, noteId: number, newTagIds: number[]): Promise<void> => {
    try {
        // First, remove all existing tags for the note
        await runAsync(db, 'DELETE FROM note_tags WHERE note_id = ?;', [noteId]);
        console.log(`All existing tags removed from Note ID ${noteId}.`);

        // Add the new tags using parameterized queries
        for (const tagId of newTagIds) {
            await addTagToNote(db, noteId, tagId);
        }

        console.log(`Tags updated for Note ID ${noteId}.`);
    } catch (error) {
        console.error(`Error updating tags for Note ID ${noteId}:`, error);
        Alert.alert("Database Error", "Failed to update note tags.");
        throw error;
    }
};
*/
