import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by ID' })
  findOne(@Param('id') id: number) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification by ID' })
  update(
    @Param('id') id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a notification by ID' })
  remove(@Param('id') id: number) {
    return this.notificationService.remove(+id);
  }

  @Get('check/:id')
  @ApiOperation({ summary: 'Check booked seats by event_id' })
  checkBookSeats(@Param('id') id: number) {
    return this.notificationService.checkBookSeats(+id);
  }
}
