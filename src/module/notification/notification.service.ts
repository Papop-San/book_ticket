import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { DbService } from '../../database/db.service';

@Injectable()
export class NotificationService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateNotificationDto) {
    try {
      const [notification] = await this.db.query(
        `
      INSERT INTO notifications (type, message, created_at, updated_at)
      VALUES ($1, $2, NOW(),  NOW())
      RETURNING *
      `,
        [dto.type, dto.message],
      );

      return notification;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Notification message already exists');
      }
      throw err;
    }
  }

  async findAll() {
    try {
      return await this.db.query(
        `
        SELECT id, type , message 
        FROM notifications 
        ORDER BY id  
        `,
      );
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      const [notification] = await this.db.query(
        `
        SELECT id, type , message
        FROM notifications 
        WHERE id = $1
        ORDER BY id  
        `,
        [id],
      );
      if (!notification) {
        throw new NotFoundException(`Notification with id ${id} not found`);
      }

      return notification;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, dto: UpdateNotificationDto) {
    try {
      const [notification] = await this.db.query(
        `
        UPDATE notifications
        SET
          type = COALESCE($1, type),
          message = COALESCE($2, message),
          updated_at = NOW()
        WHERE id = $3
        RETURNING *
        `,
        [dto.type, dto.message, id],
      );

      if (!notification) {
        throw new NotFoundException(`Notifications with id ${id} not found`);
      }
      return notification;
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    try {
      const notifications = await this.db.query(
        `
      DELETE FROM notifications 
      WHERE id = $1
      RETURNING *
      `,
        [id],
      );

      if (!notifications.length) {
        throw new NotFoundException(`Notification with id ${id} not found`);
      }

      return {
        message: `Notification with id ${id} deleted successfully`,
      };
    } catch (err) {
      throw err;
    }
  }

  async checkBookSeats(id: number) {
    try {
      const checkSeats = await this.db.query(
        `
        SELECT 1
        FROM seats
        WHERE event_id = $1
          AND status != 'BOOKED'
        LIMIT 1;
        `,
        [id],
      );

      if (checkSeats.length > 0) {
        return null;
      }

      const [notification] = await this.db.query(
        `
          SELECT id, type, message
          FROM notifications
          WHERE type = 'FULL'
          LIMIT 1
          `,
      );
      return notification;
    } catch (err) {
      throw err;
    }
  }
}
