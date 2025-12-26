import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { DbModule } from "../../database/db.module";


@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [DbModule],
})
export class BookModule {}
