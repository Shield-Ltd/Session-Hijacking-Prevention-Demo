import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in environment variables.");
}
export const db = neon(process.env.DATABASE_URL);

const schema = async () => {
  try {
    await db`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW())
    `;

    await db`
        CREATE TABLE IF NOT EXISTS sessionkeys(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        authToken_hash VARCHAR(255) UNIQUE NOT NULL,
        fingerprint VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW())
    `;

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

schema();