import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { DbModule } from "../../database/db.module";

@Module({
  controllers: [SeatsController],
  providers: [SeatsService],
  imports: [DbModule],
})
export class SeatsModule {}
