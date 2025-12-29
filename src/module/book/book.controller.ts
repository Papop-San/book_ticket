import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  async create(@Body() createBookDto: CreateBookDto) {
    const data = await this.bookService.create(createBookDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Booking created successfully',
      data,
    };
  }

  @Get('/admin')
  @ApiOperation({ summary: 'Get all bookings list' })
  async getEventBookings() {
    const data = await this.bookService.getEventBookings();
    return {
      status: HttpStatus.OK,
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings of the current user' })
  async findAll() {
    const data = await this.bookService.findAll();
    return {
      status: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single booking by ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.bookService.findOne(Number(id));
    if (!data) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return {
      status: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking by ID' })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const data = await this.bookService.update(Number(id), updateBookDto);
    return {
      status: HttpStatus.OK,
      message: 'Booking updated successfully',
      data,
    };
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Remove a booking by email' })
  async remove(@Param('email') email: string) {
    const data = await this.bookService.remove(email);
    return {
      status: HttpStatus.OK,
      message: 'Booking removed successfully',
      data,
    };
  }
}
