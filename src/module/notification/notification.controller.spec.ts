import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

describe('NotificationController', () => {
  let controller: NotificationController;

  const mockNotificationService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkBookSeats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [{ provide: NotificationService, useValue: mockNotificationService }],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  afterEach(() => jest.clearAllMocks());

  /* ---------- CREATE ---------- */
  it('should create notification', async () => {
    const dto: CreateNotificationDto = { type: 'FULL', message: 'Seat full' };
    const mockResult = { id: 1, ...dto };
    mockNotificationService.create.mockResolvedValue(mockResult);

    const result = await controller.create(dto);
    expect(mockNotificationService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });

  /* ---------- FIND ALL ---------- */
  it('should return all notifications', async () => {
    const mockResult = [{ id: 1, type: 'FULL', message: 'Seat full' }];
    mockNotificationService.findAll.mockResolvedValue(mockResult);

    const result = await controller.findAll();
    expect(mockNotificationService.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  /* ---------- FIND ONE ---------- */
  it('should return notification by id', async () => {
    const mockResult = { id: 1, type: 'FULL', message: 'Seat full' };
    mockNotificationService.findOne.mockResolvedValue(mockResult);

    const result = await controller.findOne(1);
    expect(mockNotificationService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockResult);
  });

  /* ---------- UPDATE ---------- */
  it('should update notification', async () => {
    const dto: UpdateNotificationDto = { type: 'AVAILABLE', message: 'Seat available' };
    const mockResult = { id: 1, ...dto };
    mockNotificationService.update.mockResolvedValue(mockResult);

    const result = await controller.update(1, dto);
    expect(mockNotificationService.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(mockResult);
  });

  /* ---------- REMOVE ---------- */
  it('should remove notification', async () => {
    const mockResult = { message: 'Notification with id 1 deleted successfully' };
    mockNotificationService.remove.mockResolvedValue(mockResult);

    const result = await controller.remove(1);
    expect(mockNotificationService.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockResult);
  });

  /* ---------- CHECK BOOK SEATS ---------- */
  it('should return notification or null from checkBookSeats', async () => {
    const mockNotification = { id: 1, type: 'FULL', message: 'Seat full' };
    mockNotificationService.checkBookSeats.mockResolvedValueOnce(mockNotification);

    const result = await controller.checkBookSeats(1);
    expect(mockNotificationService.checkBookSeats).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockNotification);
  });
});
