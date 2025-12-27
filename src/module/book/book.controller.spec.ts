import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto, BookingStatus } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getEventBookings: jest.fn()
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
    it('should call bookService.create and return the result', async () => {
      const dto: CreateBookDto = {
        seat_id: 1,
        status: BookingStatus.BOOKED,
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice@example.com',
      };

      mockBookService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });


  describe('findAll', () => {
    it('should call bookService.findAll and return the result', async () => {
      const books = [{ id: 1, name: 'Alice', email: 'alice@example.com' }];
      mockBookService.findAll.mockResolvedValue(books);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(books);
    });
  });

  describe('findOne', () => {
    it('should call bookService.findOne with the correct id', async () => {
      const book = { id: 1, name: 'Alice', email: 'alice@example.com' };
      mockBookService.findOne.mockResolvedValue(book);

      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(book);
    });
  });

  describe('update', () => {
    it('should call bookService.update with correct id and dto', async () => {
      const dto: UpdateBookDto = {
        seat_id: 1,
        status: BookingStatus.BOOKED,
        first_name: 'Alice Updated',
        last_name: 'Smith Updated',
        email: 'alice@example.com',
      };

      mockBookService.update.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });


  describe('remove', () => {
    it('should call bookService.remove with correct email', async () => {
      mockBookService.remove.mockResolvedValue({ message: 'Deleted' });

      const result = await controller.remove('alice@example.com');
      expect(service.remove).toHaveBeenCalledWith('alice@example.com');
      expect(result).toEqual({ message: 'Deleted' });
    });
  });

  describe('getEventBookings', () => {
  it('should call bookService.getEventBookings and return the result', async () => {
    const mockResult = [
      {
        event_id: 1,
        bookings: [
          { name: 'Alice', email: 'alice@example.com' }
        ],
        availableSeats: 9,
        status: 'Available',
      },
      {
        event_id: 2,
        bookings: [
          { name: 'Bob', email: 'bob@example.com' }
        ],
        availableSeats: 5,
        status: 'Available',
      },
    ];

    mockBookService.getEventBookings.mockResolvedValue(mockResult);

    const result = await controller.getEventBookings();

    expect(service.getEventBookings).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });
});

});
