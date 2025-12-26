import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { DbService } from '../../database/db.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('EventService', () => {
  let service: EventService;
  let db: DbService;

  const mockDbService = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: DbService, useValue: mockDbService }, 
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    db = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      mockDbService.query.mockResolvedValueOnce([]); 
      const insertedEvent = { id: 1, name: 'Flight A1', total_seats: 20 };
      mockDbService.query.mockResolvedValueOnce([insertedEvent]); 
      const result = await service.create({ name: 'Flight A1', total_seats: 20 });
      expect(result).toEqual(insertedEvent);
    });

    it('should throw ConflictException if name exists', async () => {
      mockDbService.query.mockResolvedValueOnce([{}]); 
      await expect(service.create({ name: 'Flight A1', total_seats: 20 }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return an event', async () => {
      const event = { id: 1, name: 'Flight A1', total_seats: 20 };
      mockDbService.query.mockResolvedValueOnce([event]);
      const result = await service.findOne(1);
      expect(result).toEqual(event);
    });

    it('should throw NotFoundException if not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updatedEvent = { id: 1, name: 'Flight B1', total_seats: 30 };
      mockDbService.query.mockResolvedValueOnce([updatedEvent]);
      const result = await service.update(1, { name: 'Flight B1', total_seats: 30 });
      expect(result).toEqual(updatedEvent);
    });

    it('should throw NotFoundException if not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);
      await expect(service.update(999, { name: 'X', total_seats: 10 }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an event', async () => {
      mockDbService.query.mockResolvedValueOnce([{ id: 1 }]); 
      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Event with id 1 deleted successfully', id: 1 });
    });

    it('should throw NotFoundException if not found', async () => {
      mockDbService.query.mockResolvedValueOnce([]);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
  