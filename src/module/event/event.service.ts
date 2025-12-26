import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DbService } from '../../database/db.service';

@Injectable()
export class EventService {
  constructor(private readonly db: DbService) { }

  async create(dto: CreateEventDto) {
    try {
      const [event] = await this.db.query(
        `
        INSERT INTO events (name, total_seats, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        RETURNING *
        `,
        [dto.name, dto.total_seats],
      );

      return event;
    } catch (err) {
      // PostgreSQL unique violation
      if (err.code === '23505') {
        throw new ConflictException(
          `Event name "${dto.name}" already exists`,
        );
      }
      throw err;
    }
  }

  async findAll() {
    return this.db.query(`
      SELECT id, name, total_seats, created_at, updated_at
      FROM events
      ORDER BY created_at ASC
    `);
  }

  async findOne(id: number) {
    try {
      const [event] = await this.db.query(
        `
        SELECT id, name, total_seats, created_at, updated_at
        FROM events
        WHERE id = $1
        `,
        [id],
      );

      if (!event) throw new NotFoundException('Event not found');
      return event;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, dto: UpdateEventDto) {
    try {
      const [event] = await this.db.query(
        `
      UPDATE events
      SET
        name = COALESCE($1, name),
        total_seats = COALESCE($2, total_seats),
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
        [dto.name, dto.total_seats, id],
      );

      if (!event) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }

      return event;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(
          `Event name "${dto.name}" already exists`,
        );
      }
      throw err;
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.db.query(
        'DELETE FROM events WHERE id = $1 RETURNING *',
        [id],
      );

      if (!deleted.length) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }

      return {
        message: `Event with id ${id} deleted successfully`,
        id,
      };
    } catch (err) {
      throw err;
    }
  }
}
