import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { DbService } from '../../database/db.service';
import { BookingStatus } from './dto/create-book.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let db: DbService;

  const mockDbService = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService, { provide: DbService, useValue: mockDbService }],
    }).compile();

    service = module.get<BookService>(BookService);
    db = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* ---------------- CREATE ---------------- */
  describe('create', () => {
    it('should create booking successfully', async () => {
      const dto = {
        seat_id: 1,
        name: 'John Doe',
        email: 'alice@example.com',
        status: BookingStatus.BOOKED,
      };

      mockDbService.query
        .mockResolvedValueOnce([]) // BEGIN
        .mockResolvedValueOnce([{ id: 1, status: 'AVAILABLE' }])
        .mockResolvedValueOnce([
          {
            id: 1,
            seat_id: 1,
            name: 'John Doe',
            email: 'alice@example.com',
            status: BookingStatus.BOOKED,
          },
        ]) // INSERT
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await service.create(dto);
      expect(result).toMatchObject({
        id: 1,
        seat_id: 1,
        status: BookingStatus.BOOKED,
      });
      expect(mockDbService.query).toHaveBeenCalledTimes(5);
    });

    it('should throw ConflictException if seat already booked', async () => {
      const dto = {
        seat_id: 1,
        name: 'John Doe',
        email: 'alice@example.com',
        status: BookingStatus.BOOKED,
      };

      mockDbService.query
        .mockResolvedValueOnce([]) // BEGIN
        .mockResolvedValueOnce([{ id: 1, status: 'BOOKED' }]);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  /* ---------------- FIND ALL ---------------- */
  describe('findAll', () => {
    it('should return all bookings', async () => {
      mockDbService.query.mockResolvedValueOnce([
        {
          id: 1,
          seat_id: 1,
          name: 'John Doe',
          email: 'a@b.com',
          status: BookingStatus.BOOKED,
        },
        {
          id: 2,
          seat_id: 2,
          name: 'Jane Smith',
          email: 'b@c.com',
          status: BookingStatus.BOOKED,
        },
      ]);

      const result = await service.findAll();
      expect(result.length).toBe(2);
    });
  });

  /* ---------------- FIND ONE ---------------- */
  describe('findOne', () => {
    it('should return booking by id', async () => {
      mockDbService.query.mockResolvedValueOnce([
        {
          id: 1,
          seat_id: 1,
          name: 'John Doe',
          email: 'a@b.com',
          status: BookingStatus.BOOKED,
        },
      ]);
      const result = await service.findOne(1);
      expect(result.name).toBe('John Doe');
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  /* ---------------- UPDATE ---------------- */
  describe('update', () => {
    it('should update booking successfully', async () => {
      mockDbService.query.mockResolvedValueOnce([
        {
          id: 1,
          seat_id: 1,
          name: 'Updated User',
          email: 'a@b.com',
          status: BookingStatus.BOOKED,
        },
      ]);
      const result = await service.update(1, { name: 'Updated User' });
      expect(result.booking.name).toBe('Updated User');
      expect(result.message).toBe('Updated User updated successfully');
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);
      await expect(service.update(99, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  /* ---------------- REMOVE ---------------- */
  describe('remove', () => {
    it('should delete booking and update seat', async () => {
      mockDbService.query
        .mockResolvedValueOnce([{ id: 1, seat_id: 1, name: 'John Doe' }])
        .mockResolvedValueOnce([]) // UPDATE seat
        .mockResolvedValueOnce([{ id: 1, seat_id: 1, name: 'John Doe' }]);

      const result = await service.remove('john@example.com');
      expect(result.message).toBe('John Doe cancelled, seats available again');
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);
      await expect(service.remove('notfound@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  /* ---------------- GET EVENT BOOKINGS ---------------- */
  describe('getEventBookings', () => {
    it('should return bookings grouped by event with correct availableSeats and status', async () => {
      const mockEvents = [
        { id: 1, capacity: 10, event_name: 'Event 1' },
        { id: 2, capacity: 10, event_name: 'Event 2' },
      ];

      const mockBookings1 = [
        {
          name: 'Alice Smith',
          email: 'alice@example.com',
          status: BookingStatus.BOOKED,
        },
      ];

      const mockBookings2 = [
        {
          name: 'Bob Johnson',
          email: 'bob@example.com',
          status: BookingStatus.BOOKED,
        },
        {
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          status: BookingStatus.BOOKED,
        },
      ];

      // Mock db query sequence
      mockDbService.query
        .mockResolvedValueOnce(mockEvents)
        .mockResolvedValueOnce(mockBookings1)
        .mockResolvedValueOnce(mockBookings2);

      const result = await service.getEventBookings();

      expect(result).toEqual([
        {
          event_id: 1,
          event_name: 'Event 1',
          bookings: mockBookings1,
          availableSeats: mockEvents[0].capacity - mockBookings1.length,
          status: 'Available',
        },
        {
          event_id: 2,
          event_name: 'Event 2',
          bookings: mockBookings2,
          availableSeats: mockEvents[1].capacity - mockBookings2.length, // 10 - 2 = 8
          status: 'Available',
        },
      ]);
    });
  });
});
