import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { RemoveSeatsDto } from '../event/dto/remove-event.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) { }

  @Post()
  create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatsService.create(createSeatDto);
  }

  @Get()
  findAll() {
    return this.seatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.seatsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSeatDto: UpdateSeatDto) {
    return this.seatsService.update(id, updateSeatDto);
  }

  @Delete()
  remove(@Body() dto: RemoveSeatsDto) {
    return this.seatsService.remove(dto);
  }
}
