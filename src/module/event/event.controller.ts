import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const data = await this.eventService.create(createEventDto);

    return {
      status: HttpStatus.CREATED,
      message: 'Event created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.eventService.findAll();

    return {
      status: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.eventService.findOne(Number(id));

    if (!data) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return {
      status: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const data = await this.eventService.update(Number(id), updateEventDto);

    return {
      status: HttpStatus.OK,
      message: 'Event updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.eventService.remove(Number(id));

    return {
      status: HttpStatus.OK,
      message: 'Event removed successfully',
      data,
    };
  }
}
