import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DbService } from '../../database/db.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly db: DbService) { }

  async create(dto: CreateBookDto) {
    try {
      await this.db.query('BEGIN')
      const [seat] = await this.db.query(
        `
      SELECT id, status
      FROM seats
      WHERE id = $1
      FOR UPDATE
      `,

        [dto.seat_id],
      );

      if (!seat) {
        throw new NotFoundException('Seat not found');
      }

      if (seat.status === 'BOOKED') {
        throw new ConflictException('Seat already booked');
      }

      const [book] = await this.db.query(
        `
        INSERT INTO bookings (seat_id, first_name, last_name, email, status, created_at, updated_at )
        VALUES ($1, $2, $3, $4, 'BOOKED', NOW(), NOW())
        RETURNING *
        `,
        [dto.seat_id, dto.first_name, dto.last_name, dto.email],
      );
      await this.db.query(
        `
      UPDATE seats
      SET status = 'BOOKED', updated_at = NOW()
      WHERE id = $1
      `,
        [dto.seat_id],
      );

      await this.db.query('COMMIT');
      return book

    } catch (err) {
      throw err
    }
  }

  async findAll() {
    try {
      return await this.db.query(
        `
        SELECT id , seat_id , first_name , last_name , email , status FROM bookings
         ORDER BY  seat_id
        `
      )

    } catch (err) {
      throw err;
    }

  }

  async findOne(id: number) {
  try {
    const [book] = await this.db.query(
      `
      SELECT id , seat_id , first_name , last_name , email , status 
      FROM bookings
      WHERE id = $1
      `,
      [id],
    );

    if (!book) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    return book;
  } catch (err) {
    throw err;
  }
}

  async update(id: number, dto: UpdateBookDto) {
    try {
      const [book] = await this.db.query(
        `
      UPDATE bookings
      SET
        seat_id    = COALESCE($1, seat_id),
        first_name = COALESCE($2, first_name),
        last_name  = COALESCE($3, last_name),
        email      = COALESCE($4, email),
        status     = COALESCE($5, status),
        updated_at  = NOW()
      WHERE id = $6
      RETURNING *
      `,
        [
          dto.seat_id,
          dto.first_name,
          dto.last_name,
          dto.email,
          dto.status,
          id,
        ],
      );

      if (!book) {
        throw new NotFoundException(`Booking with id ${id} not found`);
      }

      return book;
    } catch (err) {
      throw err;
    }
  }

  async remove(email: string) {
  try {
    const [booking] = await this.db.query(
      `SELECT * FROM bookings WHERE email = $1`,
      [email],
    );

    if (!booking) {
      throw new NotFoundException(`Booking with email ${email} not found`);
    }

  
    await this.db.query(
      `UPDATE seats
       SET status = 'AVAILABLE', updated_at = NOW()
       WHERE id = $1`,
      [booking.seat_id],
    );

   
    const deleted = await this.db.query(
      'DELETE FROM bookings WHERE email = $1 RETURNING *',
      [email],
    );

    if (!deleted.length) {
      throw new NotFoundException(`Booking with email ${email} not found`);
    }

    return {
      message: `Booking with email ${email} deleted successfully`,
      booking_id: booking.id,
    };
  } catch (err) {
    throw err;
  }
}
}
