import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { LibraryBook } from './entities/library-book.entity';
import { Borrowing } from './entities/borrowing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryBook, Borrowing])],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}

