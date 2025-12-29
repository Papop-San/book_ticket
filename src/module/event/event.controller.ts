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
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  async create(@Body() createEventDto: CreateEventDto) {
    const data = await this.eventService.create(createEventDto);

    return {
      status: HttpStatus.CREATED,
      message: 'Event created successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async findAll() {
    const data = await this.eventService.findAll();

    return {
      status: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
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
  @ApiOperation({ summary: 'Update an event by ID' })
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
  @ApiOperation({ summary: 'Delete an event by ID' })
  async remove(@Param('id') id: string) {
    const data = await this.eventService.remove(Number(id));

    return {
      status: HttpStatus.OK,
      message: 'Event removed successfully',
      data,
    };
  }
}
