import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

export async function initDB(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export interface Message {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

export async function getMessages(): Promise<Message[]> {
  const result = await pool.query(
    'SELECT * FROM messages ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function createMessage(author: string, content: string): Promise<Message> {
  const result = await pool.query(
    'INSERT INTO messages (author, content) VALUES ($1, $2) RETURNING *',
    [author, content]
  );
  return result.rows[0];
}
