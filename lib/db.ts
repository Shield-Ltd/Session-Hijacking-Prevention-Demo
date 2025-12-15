import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in environment variables.");
}
export const db = neon(process.env.DATABASE_URL);

const schema = async () => {
  try {
    await db`
      CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW())
    `;

    await db`
      CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      auth_token_hash VARCHAR(255) NOT NULL,
      fingerprint VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, fingerprint)
      )
    `;

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

schema();