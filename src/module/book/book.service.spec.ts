import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { DbService } from '../../database/db.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BookingStatus } from './dto/create-book.dto';

describe('BookService', () => {
  let service: BookService;
  let db: DbService;

  const mockDbService = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: DbService, useValue: mockDbService },
      ],
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
        first_name: 'John',
        last_name: 'Doe',
        email: 'alice@example.com',
        status: BookingStatus.BOOKED,
      };

      mockDbService.query
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ id: 1, status: 'AVAILABLE' }])
        .mockResolvedValueOnce([
          {
            id: 1,
            seat_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'alice@example.com',
            status: 'BOOKED',
          },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await service.create(dto);

      expect(result).toMatchObject({
        id: 1,
        seat_id: 1,
        status: 'BOOKED',
      });

      expect(mockDbService.query).toHaveBeenCalledTimes(5);
    });
  });

  /* ---------------- FIND ALL ---------------- */
  describe('findAll', () => {
    it('should return all bookings', async () => {
      mockDbService.query.mockResolvedValueOnce([
        { id: 1, seat_id: 1 },
        { id: 2, seat_id: 2 },
      ]);

      const result = await service.findAll();

      expect(result.length).toBe(2);
      expect(mockDbService.query).toHaveBeenCalledTimes(1);
    });
  });

  /* ---------------- FIND ONE ---------------- */
  describe('findOne', () => {
    it('should return booking by id', async () => {
      mockDbService.query.mockResolvedValueOnce([
        { id: 1, seat_id: 1 },
      ]);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.seat_id).toBe(1);
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
        { id: 1, first_name: 'Updated' },
      ]);

      const result = await service.update(1, {
        first_name: 'Updated',
      });

      expect(result.first_name).toBe('Updated');
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);

      await expect(
        service.update(99, { first_name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  /* ---------------- REMOVE ---------------- */
  describe('remove', () => {
    it('should delete booking and update seat', async () => {
      mockDbService.query
        .mockResolvedValueOnce([
          { id: 1, seat_id: 5 },
        ]) // SELECT booking
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { id: 1 },
        ]);

      const result = await service.remove('john@test.com');

      expect(result.message).toContain('deleted successfully');
      expect(mockDbService.query).toHaveBeenCalledTimes(3);
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);

      await expect(
        service.remove('notfound@test.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});






