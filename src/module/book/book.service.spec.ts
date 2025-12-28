  import { Test, TestingModule } from '@nestjs/testing';
  import { BookService } from './book.service';
  import { DbService } from '../../database/db.service';
  import { BookingStatus } from './dto/create-book.dto';
  import { NotFoundException } from '@nestjs/common';

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
       const dto = { seat_id: 1, name: 'John Doe', email: 'alice@example.com' , status: BookingStatus.BOOKED };


        mockDbService.query
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([{ id: 1, status: BookingStatus.BOOKED }])
          .mockResolvedValueOnce([{ id: 1, seat_id: 1, name: 'John Doe', email: 'alice@example.com', status: BookingStatus.BOOKED}])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([]);

        const result = await service.create(dto);

        expect(result).toMatchObject({ id: 1, seat_id: 1, status: BookingStatus.BOOKED });
        expect(mockDbService.query).toHaveBeenCalledTimes(5);
      });
    });

    /* ---------------- FIND ALL ---------------- */
    describe('findAll', () => {
      it('should return all bookings', async () => {
        mockDbService.query.mockResolvedValueOnce([
          { id: 1, seat_id: 1, name: 'John Doe', email: 'a@b.com', status: BookingStatus.BOOKED },
          { id: 2, seat_id: 2, name: 'Jane Smith', email: 'b@c.com', status: BookingStatus.BOOKED },
        ]);

        const result = await service.findAll();

        expect(result.length).toBe(2);
        expect(mockDbService.query).toHaveBeenCalledTimes(1);
      });
    });

    /* ---------------- FIND ONE ---------------- */
    describe('findOne', () => {
      it('should return booking by id', async () => {
        mockDbService.query.mockResolvedValueOnce([{ id: 1, seat_id: 1, name: 'John Doe', email: 'a@b.com', status: BookingStatus.BOOKED }]);
        const result = await service.findOne(1);
        expect(result.id).toBe(1);
        expect(result.seat_id).toBe(1);
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
        mockDbService.query.mockResolvedValueOnce([{ id: 1, name: 'Updated User', seat_id: 1, email: 'a@b.com', status: BookingStatus.BOOKED }]);
        const result = await service.update(1, { name: 'Updated User' });
        expect(result.booking.name).toBe('Updated User');
        expect(result.message).toBe('Updated User updated successfully');
      });

      it('should throw NotFoundException if booking not found', async () => {
        mockDbService.query.mockResolvedValueOnce([]);
        await expect(service.update(99, { name: 'Test' })).rejects.toThrow(NotFoundException);
      });
    });

    /* ---------------- REMOVE ---------------- */
    describe('remove', () => {
      it('should delete booking and update seat', async () => {
        mockDbService.query
          .mockResolvedValueOnce([{ id: 1, name: 'John Doe', seat_id: 1 }])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([{ id: 1, name: 'John Doe', seat_id: 1 }]);

        const result = await service.remove('john@example.com');
        expect(result.message).toBe('John Doe cancelled, seats available again');
      });

      it('should throw NotFoundException if booking not found', async () => {
        mockDbService.query.mockResolvedValueOnce([]);
        await expect(service.remove('notfound@example.com')).rejects.toThrow(NotFoundException);
      });
    });

    /* ---------------- GET EVENT BOOKINGS ---------------- */
    describe('getEventBookings', () => {
      it('should return bookings grouped by event', async () => {
        const mockResult = [
          {
            event_id: 1,
            bookings: [{ name: 'Alice Smith', email: 'alice@example.com', status: BookingStatus.BOOKED }],
            availableSeats: 9,
            status: 'Available',
          },
          {
            event_id: 2,
            bookings: [
              { name: 'Bob Johnson', email: 'bob@example.com', status: BookingStatus.BOOKED },
              { name: 'Charlie Brown', email: 'charlie@example.com', status: BookingStatus.BOOKED },
            ],
            availableSeats: 8,
            status: 'Available',
          },
        ];

        mockDbService.query.mockResolvedValueOnce(mockResult);
        const result = await service.getEventBookings();
        expect(mockDbService.query).toHaveBeenCalled();
        expect(result).toEqual(mockResult);
      });
    });
  });
