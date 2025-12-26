import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DbService } from '../../database/db.service';

@Injectable()
export class EventService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateEventDto) {
    const [existingEvent] = await this.db.query(
      'SELECT * FROM events WHERE name = $1',
      [dto.name],
    );
    if (existingEvent) throw new ConflictException('Event name already exists');

    const [event] = await this.db.query(
      `
      INSERT INTO events (name, total_seats, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *
      `,
      [dto.name, dto.total_seats],
    );

    return event;
  }

  async findAll() {
    const events = await this.db.query(`
      SELECT id, name, total_seats, created_at, updated_at
      FROM events
      ORDER BY created_at ASC
    `);
    return events;
  }

  async findOne(id: number) {
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
  }

  async update(id: number, dto: UpdateEventDto) {
    const [event] = await this.db.query(
      `
      UPDATE events
      SET name = $1,
          total_seats = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [dto.name, dto.total_seats, id],
    );

    if (!event) throw new NotFoundException(`Event with id ${id} not found`);
    return event;
  }

  async remove(id: number) {
    const deletedRows = await this.db.query(
      `DELETE FROM events WHERE id = $1 RETURNING id`,
      [id],
    );

    if (!deletedRows.length) throw new NotFoundException(`Event with id ${id} not found`);
    return { message: `Event with id ${id} deleted successfully` };
  }
}
