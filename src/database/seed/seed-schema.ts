import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function seedSchema() {
  try {
    await pool.query(`
      -- Drop old tables and types
      DROP TABLE IF EXISTS bookings CASCADE;
      DROP TABLE IF EXISTS seats CASCADE;
      DROP TABLE IF EXISTS events CASCADE;
      DROP TABLE IF EXISTS notifications CASCADE;
      DROP TYPE IF EXISTS seat_status;

      -- Create Enum
      CREATE TYPE seat_status AS ENUM ('AVAILABLE', 'BOOKED');

      -- Create tables
      CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        capacity INTEGER NOT NULL CHECK (capacity > 0),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE seats (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
        seat_code VARCHAR(10) NOT NULL,
        status seat_status DEFAULT 'AVAILABLE' NOT NULL,
        created_at TIMESTAMP DEFAULT now() NOT NULL,
        updated_at TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT unique_event_seat UNIQUE (event_id, seat_code)
      );

      CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        seat_id INTEGER NOT NULL REFERENCES seats(id),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        status VARCHAR(20) DEFAULT 'BOOKED' NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE notifications (
        id SERIAL PRIMARY KEY,
        type VARCHAR NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        CONSTRAINT notifications_type_message_unique UNIQUE (type, message)
      );
    `);

    console.log('✅ Schema created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating schema:', error);
    process.exit(1);
  }
}

seedSchema();
