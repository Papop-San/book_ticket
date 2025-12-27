import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DbService } from '../../database/db.service';
import { dot } from 'node:test/reporters';

@Injectable()
export class EventService {
  constructor(private readonly db: DbService) { }

  async create(dto: CreateEventDto) {
    try {
      const [event] = await this.db.query(
        `
        INSERT INTO events (name, capacity, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        RETURNING *
        `,
        [dto.name , dto.capacity],
      );

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

  async findAll() {
    return this.db.query(`
      SELECT id, name, capacity
      FROM events
      ORDER BY created_at ASC
    `);
  }

  async findOne(id: number) {
    try {
      const [event] = await this.db.query(
        `
        SELECT id, name, capacity
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
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
        [dto.name,  id],
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
