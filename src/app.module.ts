import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './database/db.module';
import { EventModule } from './module/event/event.module';

@Module({
  imports: [DbModule ,EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
