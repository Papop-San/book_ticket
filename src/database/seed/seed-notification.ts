import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function seedNotifications() {
  const notifications = [
    { type: 'AVAILABLE', message: 'ยังมีที่นั่งว่าง สามารถจองได้' },
    { type: 'FULL', message: 'ที่นั่งเต็มแล้ว ไม่สามารถจองเพิ่มเติมได้' },
  ];

  for (const notif of notifications) {
    await pool.query(
      `
      INSERT INTO notifications (type, message, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      `,
      [notif.type, notif.message],
    );
  }

  console.log('Notifications seeded');
  process.exit();
}

seedNotifications();
