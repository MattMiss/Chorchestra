import { openDatabaseAsync } from 'expo-sqlite';
import { SQLRunResult, SQLRow, SQLRows } from './types';

// Open or create the database asynchronously
const openDb = async () => {
    return await openDatabaseAsync('chores.db');
};

// Function to create the necessary tables
export const createTables = async (): Promise<void> => {
    const db = await openDb();

    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      status TEXT DEFAULT 'active'
    );
    
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    
    CREATE TABLE IF NOT EXISTS note_tags (
      note_id INTEGER,
      tag_id INTEGER,
      FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
      PRIMARY KEY (note_id, tag_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
    CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
    CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
    CREATE INDEX IF NOT EXISTS idx_note_tags_note_id ON note_tags(note_id);
    CREATE INDEX IF NOT EXISTS idx_note_tags_tag_id ON note_tags(tag_id);
  `);
};

// Function to insert a new note with or without tags
export const insertNoteWithTags = async (title: string, content: string, status: string = 'active', tagIds: number[] = []): Promise<SQLRunResult> => {
    const db = await openDb();

    // Insert the note using parameterized queries
    const result: SQLRunResult = await db.runAsync(
        'INSERT INTO chores (title, content, created_at, updated_at, status) VALUES (?, ?, ?, ?, ?)',
        title, content, Date.now(), Date.now(), status
    );

    // Add tags to the note if tagIds were provided
    if (tagIds.length > 0) {
        for (const tagId of tagIds) {
            await addTagToNote(result.lastInsertRowId!, tagId);
        }
    }

    return result;
};

// Function to retrieve all chores
export const getAllNotes = async (): Promise<SQLRows> => {
    const db = await openDb();
    return await db.getAllAsync('SELECT * FROM chores');
};

// Function to retrieve a single note
export const getFirstNote = async (id: number): Promise<SQLRow | null> => {
    const db = await openDb();

    // Use a parameterized query to retrieve a single note
    return await db.getFirstAsync('SELECT * FROM chores WHERE id = ?', id);
};

// Function to update a note
export const updateNote = async (id: number, updatedContent: string): Promise<void> => {
    const db = await openDb();

    // Use a parameterized query to update a note
    await db.runAsync(
        'UPDATE chores SET content = ?, updated_at = ? WHERE id = ?',
        updatedContent, Date.now(), id
    );
};

// Function to delete a note
export const deleteNote = async (id: number): Promise<void> => {
    const db = await openDb();

    // Use a parameterized query to delete a note
    await db.runAsync('DELETE FROM chores WHERE id = ?', id);
};

// Function to get all tags from the 'tags' table
export const getAllTags = async (): Promise<SQLRows> => {
    const db = await openDb();

    // Fetch all tags from the 'tags' table
    return await db.getAllAsync('SELECT * FROM tags');
};

// Function to get a tag by name
export const getTagByName = async (name: string): Promise<SQLRow | null> => {
    const db = await openDb();

    return await db.getFirstAsync('SELECT * FROM tags WHERE name = ?', name);
};

// Function to create a tag
export const createTag = async (name: string): Promise<SQLRunResult> => {
    const db = await openDb();

    // Use a parameterized query to create a tag
    return await db.runAsync('INSERT INTO tags (name) VALUES (?)', name);
};

// Function to update a tag
export const updateTag = async (id: number, name: string): Promise<void> => {
    const db = await openDb();

    // Use a parameterized query to update a tag
    await db.runAsync('UPDATE tags SET name = ? WHERE id = ?', name, id);
};

// Function to delete a tag
export const deleteTag = async (id: number): Promise<void> => {
    const db = await openDb();

    // Use a parameterized query to delete a tag
    await db.runAsync('DELETE FROM tags WHERE id = ?', id);
};

// Function to add a tag to a note
export const addTagToNote = async (noteId: number, tagId: number): Promise<void> => {
    const db = await openDb();

    // Use a parameterized query to add a tag to a note
    await db.runAsync('INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)', noteId, tagId);
};

// Function to remove a tag from a note
export const removeTagFromNote = async (noteId: number, tagId: number): Promise<void> => {
    const db = await openDb();

    // Use a parameterized query to remove a tag from a note
    await db.runAsync('DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?', noteId, tagId);
};

// Function to update tags for a note
export const updateTagsForNote = async (noteId: number, newTagIds: number[]): Promise<void> => {
    const db = await openDb();

    // First, remove all existing tags for the note
    await db.runAsync('DELETE FROM note_tags WHERE note_id = ?', noteId);

    // Add the new tags using parameterized queries
    for (const tagId of newTagIds) {
        await addTagToNote(noteId, tagId);
    }
};

// Function to update the status of a note
export const updateNoteStatus = async (id: number, status: string): Promise<void> => {
    const db = await openDb();

    // Use a parameterized query to update the note status
    await db.runAsync(
        'UPDATE chores SET status = ?, updated_at = ? WHERE id = ?',
        status, Date.now(), id
    );
};
