import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  const mockEventService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [{ provide: EventService, useValue: mockEventService }],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call eventService.create and return result', async () => {
      const dto: CreateEventDto = {
        name: 'Concert',
        capacity: 10
      };

      const mockResult = {
        id: 1,
        ...dto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockEventService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should call eventService.findAll and return result', async () => {
      const mockResult = [{ id: 1, name: 'Concert', date: new Date() }];
      mockEventService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should call eventService.findOne with correct id', async () => {
      const mockResult = { id: 1, name: 'Concert', date: new Date() };
      mockEventService.findOne.mockResolvedValue(mockResult);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should call eventService.update with correct id and dto', async () => {
      const dto: UpdateEventDto = { name: 'Updated Concert' };
      const mockResult = { id: 1, ...dto };

      mockEventService.update.mockResolvedValue(mockResult);

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should call eventService.remove with correct id', async () => {
      const mockResult = { message: 'Deleted' };
      mockEventService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });
});
