import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { DbModule } from "../../database/db.module";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [DbModule]
})
export class NotificationModule {}
