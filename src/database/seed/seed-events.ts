import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function seedEvents() {
  const events = [
    { name: 'Flight Phuket', capacity: 10 },
    { name: 'Flight Bangkok', capacity: 10 },
    { name: 'Flight Chiang Mai', capacity: 10 },
  ];

  for (const event of events) {
    await pool.query(
      `
        INSERT INTO events (name, capacity,  created_at, updated_at)
        VALUES ($1, $2 ,NOW(), NOW())
        `,
      [event.name, event.capacity],
    );
  }

  console.log('Events seeded');
  process.exit();
}

seedEvents();
