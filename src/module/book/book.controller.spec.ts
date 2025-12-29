import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto, BookingStatus } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { HttpStatus, NotFoundException } from '@nestjs/common';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getEventBookings: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: mockBookService }],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call bookService.create and return response with status and message', async () => {
      const dto: CreateBookDto = {
        seat_id: 1,
        status: BookingStatus.BOOKED,
        name: 'alice',
        email: 'alice@example.com',
      };

      mockBookService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        message: 'Booking created successfully',
        data: { id: 1, ...dto },
      });
    });
  });

  describe('findAll', () => {
    it('should call bookService.findAll and return response with status', async () => {
      const books = [{ id: 1, name: 'Alice', email: 'alice@example.com' }];
      mockBookService.findAll.mockResolvedValue(books);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: books,
      });
    });
  });

  describe('findOne', () => {
    it('should call bookService.findOne with the correct id and return response with status', async () => {
      const book = { id: 1, name: 'Alice', email: 'alice@example.com' };
      mockBookService.findOne.mockResolvedValue(book);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: book,
      });
    });

    it('should throw NotFoundException if book not found', async () => {
      mockBookService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call bookService.update and return response with status and message', async () => {
      const dto: UpdateBookDto = {
        seat_id: 1,
        status: BookingStatus.BOOKED,
        name: 'alice',
        email: 'alice@example.com',
      };

      mockBookService.update.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Booking updated successfully',
        data: { id: 1, ...dto },
      });
    });
  });

  describe('remove', () => {
    it('should call bookService.remove and return response with status and message', async () => {
      mockBookService.remove.mockResolvedValue({
        id: 1,
        email: 'alice@example.com',
      });

      const result = await controller.remove('alice@example.com');
      expect(service.remove).toHaveBeenCalledWith('alice@example.com');
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Booking removed successfully',
        data: { id: 1, email: 'alice@example.com' },
      });
    });
  });

  describe('getEventBookings', () => {
    it('should call bookService.getEventBookings and return response with status', async () => {
      const mockResult = [
        {
          event_id: 1,
          bookings: [{ name: 'Alice', email: 'alice@example.com' }],
          availableSeats: 9,
          status: 'Available',
        },
        {
          event_id: 2,
          bookings: [{ name: 'Bob', email: 'bob@example.com' }],
          availableSeats: 5,
          status: 'Available',
        },
      ];

      mockBookService.getEventBookings.mockResolvedValue(mockResult);

      const result = await controller.getEventBookings();

      expect(service.getEventBookings).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: mockResult,
      });
    });
  });
});
