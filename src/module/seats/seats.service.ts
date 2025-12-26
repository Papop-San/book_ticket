import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateSeatDto, Seat } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { RemoveSeatsDto } from '../event/dto/remove-event.dto';
import { DbService } from '../../database/db.service';

@Injectable()
export class SeatsService {
  constructor(private readonly db: DbService) { }

  async create(dto: CreateSeatDto) {
    try {
      const result: Seat[] = [];

      for (const seatCode of dto.seat_codes) {
        const [seat] = await this.db.query(
          `
          INSERT INTO seats (event_id, seat_code, status, created_at, updated_at)
          VALUES ($1, $2, 'AVAILABLE', NOW(), NOW())
          RETURNING *
          `,
          [dto.event_id, seatCode],
        );

        result.push(seat);
      }


      return result;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Seat already exists');
      }
      throw err;
    }
  }

  async findAll() {
    try {
      return await this.db.query(
        `
        SELECT id, event_id, seat_code, status
        FROM seats
        ORDER BY event_id, seat_code
        `,
      );
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      const [seat] = await this.db.query(
        `
      SELECT id, event_id, seat_code, status
      FROM seats
       WHERE id = $1
    `,
        [id],
      );

      if (!seat) {
        throw new NotFoundException(`Seat with id ${id} not found`);
      }

      return seat;
    } catch (err) {
      throw err
    }
  }

  async update(id: number, dto: UpdateSeatDto) {
    try {
      const [seat] = await this.db.query(
        `
      UPDATE seats
      SET
        seat_code = COALESCE($1, seat_code),
        status = COALESCE($2, status),
        event_id = COALESCE($3, event_id),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
        [dto.seat_code, dto.status, dto.event_id, id],
      );

      if (!seat) {
        throw new NotFoundException(`Seat with id ${id} not found`);
      }

      return seat;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Seat already exists in this event');
      }
      throw err;
    }
  }

  async remove(dto: RemoveSeatsDto) {
    try {
      if (dto.ids.length === 0) {
        return [];
      }

      const seats = await this.db.query(
        `
      DELETE FROM seats
      WHERE id = ANY($1)
      RETURNING *
      `,
        [dto.ids],
      );

      if (!seats.length) {
        throw new NotFoundException('No seats found to delete');
      }

      return seats;
    } catch (err) {
      throw err;
    }
  }
}
