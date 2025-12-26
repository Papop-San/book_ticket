import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function seedEvents() {
    const events = [
        { name: 'Flight Phuket', total_seats: 20 },
        { name: 'Flight Bangkok', total_seats: 25 },
        { name: 'Flight Chiang Mai', total_seats: 30 },
    ];

    for (const event of events) {
        await pool.query(
            `
        INSERT INTO events (name, total_seats, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        `,
            [event.name, event.total_seats],
        );
    }

    console.log('Events seeded');
    process.exit();
}

seedEvents();
