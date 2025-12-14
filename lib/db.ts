import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("⚠️ Missing DATABASE_URL in environment variables.");
  console.error("Please create a .env.local file with your DATABASE_URL");
}

export const db = process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL)
  : null;

const schema = async () => {
  if (!db) {
    console.error("⚠️ Cannot initialize database: DATABASE_URL is missing");
    return;
  }
  
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

    console.log("✅ Database initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    console.error("Please check your DATABASE_URL connection string");
  }
};

schema();