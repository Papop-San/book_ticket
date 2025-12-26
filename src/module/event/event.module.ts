import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { DbModule } from "../../database/db.module";

@Module({
  imports: [DbModule], 
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}