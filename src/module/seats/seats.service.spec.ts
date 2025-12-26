import { Test, TestingModule } from '@nestjs/testing';
import { SeatsService } from './seats.service';
import { DbService } from '../../database/db.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('SeatsService', () => {
  let service: SeatsService;
  let db: DbService;

  const mockDbService = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatsService,
        { provide: DbService, useValue: mockDbService },
      ],
    }).compile();

    service = module.get<SeatsService>(SeatsService);
    db = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* ---------------- CREATE ---------------- */
  describe('create', () => {
    it('should create seats (multiple)', async () => {
      const dto = {
        event_id: 1,
        seat_codes: ['A1', 'A2'],
      };

      mockDbService.query
        .mockResolvedValueOnce([{ id: 1, seat_code: 'A1' }])
        .mockResolvedValueOnce([{ id: 2, seat_code: 'A2' }]);

      const result = await service.create(dto);

      expect(result).toEqual([
        { id: 1, seat_code: 'A1' },
        { id: 2, seat_code: 'A2' },
      ]);

      expect(mockDbService.query).toHaveBeenCalledTimes(2);
    });
  });

  /* ---------------- FIND ALL ---------------- */
  describe('findAll', () => {
    it('should return all seats', async () => {
      const seats = [
        { id: 1, seat_code: 'A1', status: 'AVAILABLE' },
      ];

      mockDbService.query.mockResolvedValueOnce(seats);

      const result = await service.findAll();
      expect(result).toEqual(seats);
    });
  });

  /* ---------------- FIND ONE ---------------- */
  describe('findOne', () => {
    it('should return a seat', async () => {
      const seat = { id: 1, seat_code: 'A1', status: 'AVAILABLE' };

      mockDbService.query.mockResolvedValueOnce([seat]);

      const result = await service.findOne(1);
      expect(result).toEqual(seat);
    });

    it('should throw NotFoundException if seat not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);

      await expect(service.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  /* ---------------- UPDATE ---------------- */
  describe('update', () => {
    it('should update a seat', async () => {
      const updatedSeat = {
        id: 1,
        seat_code: 'B1',
        status: 'BOOKED',
      };

      mockDbService.query.mockResolvedValueOnce([updatedSeat]);

      const result = await service.update(1, {
        seat_code: 'B1',
        status: 'BOOKED',
      });

      expect(result).toEqual(updatedSeat);
    });

    it('should throw NotFoundException if seat not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);

      await expect(
        service.update(999, { seat_code: 'X1' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  /* ---------------- REMOVE ---------------- */
  describe('remove', () => {
    it('should remove multiple seats', async () => {
      const deletedSeats = [{ id: 1 }, { id: 2 }];

      mockDbService.query.mockResolvedValueOnce(deletedSeats);

      const result = await service.remove({
        ids: [1, 2],
      });

      expect(result).toEqual(deletedSeats);
    });

    it('should throw NotFoundException if no seats deleted', async () => {
      mockDbService.query.mockResolvedValueOnce([]);

      await expect(
        service.remove({ ids: [999] }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
