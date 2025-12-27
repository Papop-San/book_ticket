import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './database/db.module';
import { EventModule } from './module/event/event.module';
import { SeatsModule } from './module/seats/seats.module';
import { BookModule } from './module/book/book.module';
import { NotificationModule } from './module/notification/notification.module';

@Module({
  imports: [DbModule ,EventModule, SeatsModule, BookModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
