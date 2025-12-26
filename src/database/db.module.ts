import { Global , Module } from "@nestjs/common";
import { DbService } from "./db.service";
import { EventModule } from "src/module/event/event.module";



@Global()
@Module({
    providers: [DbService],
    exports: [DbService],
    imports: [EventModule],
})
export class DbModule {}