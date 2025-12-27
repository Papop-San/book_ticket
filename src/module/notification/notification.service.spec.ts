import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { DbService } from '../../database/db.service';
import {
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

describe('NotificationService', () => {
  let service: NotificationService;
  let dbService: { query: jest.Mock };

  beforeEach(async () => {
    dbService = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: DbService,
          useValue: dbService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ---------- CREATE ---------- */
  describe('create', () => {
    it('should create notification', async () => {
      dbService.query.mockResolvedValueOnce([
        { id: 1, type: 'FULL', message: 'Seat full' },
      ]);

      const result = await service.create({
        type: 'FULL',
        message: 'Seat full',
      });

      expect(result.id).toBe(1);
    });

    it('should throw ConflictException on duplicate', async () => {
      dbService.query.mockRejectedValueOnce({ code: '23505' });

      await expect(
        service.create({
          type: 'FULL',
          message: 'Duplicate',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  /* ---------- FIND ALL ---------- */
  describe('findAll', () => {
    it('should return notifications', async () => {
      dbService.query.mockResolvedValueOnce([
        { id: 1, type: 'FULL', message: 'Seat full' },
      ]);

      const result = await service.findAll();

      expect(result.length).toBe(1);
    });
  });

  /* ---------- FIND ONE ---------- */
  describe('findOne', () => {
    it('should return notification', async () => {
      dbService.query.mockResolvedValueOnce([
        { id: 1, type: 'FULL', message: 'Seat full' },
      ]);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException', async () => {
      dbService.query.mockResolvedValueOnce([]);

      await expect(service.findOne(99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  /* ---------- UPDATE ---------- */
  describe('update', () => {
    it('should update notification', async () => {
      dbService.query.mockResolvedValueOnce([
        { id: 1, type: 'AVAILABLE', message: 'Seat available' },
      ]);

      const result = await service.update(1, {
        message: 'Seat available',
      });

      expect(result.type).toBe('AVAILABLE');
    });

    it('should throw NotFoundException', async () => {
      dbService.query.mockResolvedValueOnce([]);

      await expect(
        service.update(99, { message: 'Fail' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  /* ---------- REMOVE ---------- */
  describe('remove', () => {
    it('should delete notification', async () => {
      dbService.query.mockResolvedValueOnce([
        { id: 1 },
      ]);

      const result = await service.remove(1);

      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException', async () => {
      dbService.query.mockResolvedValueOnce([]);

      await expect(service.remove(99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });


  /* ---------- CheckSeats ---------- */
  describe('checkBookSeats', () => {
    it('should return null if there is any seat not booked', async () => {
      dbService.query.mockResolvedValueOnce([{ 1: 1 }]);

      const result = await service.checkBookSeats(1);

      expect(dbService.query).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should return FULL notification if all seats are booked', async () => {

      dbService.query.mockResolvedValueOnce([]);

      const mockNotification = {
        id: 1,
        type: 'FULL',
        message: 'Seat is full',
      };

      dbService.query.mockResolvedValueOnce([mockNotification]);

      const result = await service.checkBookSeats(1);

      expect(dbService.query).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockNotification);
    });

    it('should return undefined if seats are booked but no FULL notification exists', async () => {

      dbService.query.mockResolvedValueOnce([]);

      dbService.query.mockResolvedValueOnce([]);

      const result = await service.checkBookSeats(1);

      expect(dbService.query).toHaveBeenCalledTimes(2);
      expect(result).toBeUndefined();
    });
  });

});
