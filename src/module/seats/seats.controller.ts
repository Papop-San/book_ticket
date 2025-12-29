import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { RemoveSeatsDto } from './dto/remove-event.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Seats')
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new seat' })
  async create(@Body() createSeatDto: CreateSeatDto) {
    const data = await this.seatsService.create(createSeatDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Seat created successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all seats' })
  async findAll() {
    const data = await this.seatsService.findAll();
    return {
      status: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a seat by ID' })
  async findOne(@Param('id') id: number) {
    const data = await this.seatsService.findOne(Number(id));
    return {
      status: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a seat by ID' })
  async update(@Param('id') id: number, @Body() updateSeatDto: UpdateSeatDto) {
    const data = await this.seatsService.update(Number(id), updateSeatDto);
    return {
      status: HttpStatus.OK,
      message: 'Seat updated successfully',
      data,
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Remove single seat' })
  async remove(@Body() dto: RemoveSeatsDto) {
    const data = await this.seatsService.remove(dto);
    return {
      status: HttpStatus.OK,
      message: 'Seat(s) removed successfully',
      data,
    };
  }

  @Get('event/:id')
  @ApiOperation({ summary: 'Get all seats for a event_id' })
  async findEvent(@Param('id') id: string) {
    const data = await this.seatsService.findEvent(Number(id));
    return {
      status: HttpStatus.OK,
      data,
    };
  }
}
