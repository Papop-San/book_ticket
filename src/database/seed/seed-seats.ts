import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function seedSeats() {
  const { rows: events } = await pool.query('SELECT id FROM events');

  for (const event of events) {
    const rows = ['A', 'B'];
    const seatsPerRow = 5;

    for (const row of rows) {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatCode = `${row}${i}`;
        await pool.query(
          `
                    INSERT INTO seats (event_id, seat_code, status, created_at, updated_at)
                    VALUES ($1, $2, 'AVAILABLE', NOW(), NOW())
                    `,
          [event.id, seatCode],
        );
      }
    }
  }

  console.log('Seats seeded');
  process.exit();
}

seedSeats();
