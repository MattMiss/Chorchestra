// database/types.ts

// Result for write operations like INSERT, UPDATE, DELETE
export interface SQLRunResult {
    lastInsertRowId?: number; // The ID of the last inserted row (if applicable)
    changes: number; // Number of rows affected by the query
}

// Result for fetching a single row
export interface SQLRow {
    [key: string]: any; // Rows can have dynamic fields (e.g., id, value, etc.)
}

// SQLRows is now simply an array of SQLRow objects
export type SQLRows = SQLRow[];
