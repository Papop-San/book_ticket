import { Test, TestingModule } from '@nestjs/testing';
import { SeatsController } from './seats.controller';
import { SeatsService } from './seats.service';
import { CreateSeatDto, Seat, SeatStatus } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { RemoveSeatsDto } from './dto/remove-event.dto';

describe('SeatsController', () => {
  let controller: SeatsController;
  let service: SeatsService;

  const mockSeatService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeatsController],
      providers: [{ provide: SeatsService, useValue: mockSeatService }],
    }).compile();

    controller = module.get<SeatsController>(SeatsController);
    service = module.get<SeatsService>(SeatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call seatsService.create and return formatted response', async () => {
      const dto: CreateSeatDto = {
        event_id: 1,
        seat_codes: ['A1', 'A2'],
      };

      const mockSeats: Seat[] = dto.seat_codes.map((code, index) => ({
        id: index + 1,
        event_id: dto.event_id,
        seat_code: code,
        status: SeatStatus.AVAILABLE,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      mockSeatService.create.mockResolvedValue(mockSeats);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        data: mockSeats,
        message: 'Seat created successfully',
        status: 201,
      });
    });
  });

  describe('findAll', () => {
    it('should call seatsService.findAll and return all seats', async () => {
      const seats: Seat[] = [
        {
          id: 1,
          event_id: 1,
          seat_code: 'A1',
          status: SeatStatus.AVAILABLE,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockSeatService.findAll.mockResolvedValue(seats);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(seats);
    });
  });

  describe('findOne', () => {
    it('should call seatsService.findOne with correct id and return seat', async () => {
      const seat: Seat = {
        id: 1,
        event_id: 1,
        seat_code: 'A1',
        status: SeatStatus.AVAILABLE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSeatService.findOne.mockResolvedValue(seat);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(seat);
    });
  });

  describe('findOne', () => {
    it('should call seatsService.findOne with correct id', async () => {
      const seat: Seat = {
        id: 1,
        event_id: 1,
        seat_code: 'A1',
        status: SeatStatus.AVAILABLE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSeatService.findOne.mockResolvedValue(seat);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        data: seat,
        status: 200,
      });
    });
  });

  describe('update', () => {
    it('should call seatsService.update with correct id and dto', async () => {
      const dto: UpdateSeatDto = { status: SeatStatus.BOOKED };

      const updatedSeat: Seat = {
        id: 1,
        event_id: 1,
        seat_code: 'A1',
        status: SeatStatus.BOOKED,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSeatService.update.mockResolvedValue(updatedSeat);

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({
        data: updatedSeat,
        message: 'Seat updated successfully',
        status: 200,
      });
    });
  });

  describe('remove', () => {
    it('should call seatsService.remove with correct dto', async () => {
      const dto: RemoveSeatsDto = { ids: [1, 2] };

      const mockResult = { message: 'Seats deleted successfully' };
      mockSeatService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove(dto);

      expect(service.remove).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        data: mockResult,
        message: 'Seat(s) removed successfully',
        status: 200,
      });
    });
  });
});
