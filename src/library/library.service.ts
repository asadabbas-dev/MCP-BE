import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibraryBook } from './entities/library-book.entity';
import { Borrowing } from './entities/borrowing.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(LibraryBook)
    private booksRepository: Repository<LibraryBook>,
    @InjectRepository(Borrowing)
    private borrowingsRepository: Repository<Borrowing>,
  ) {}

  async findAllBooks(): Promise<LibraryBook[]> {
    return this.booksRepository.find({ order: { title: 'ASC' } });
  }

  async searchBooks(query: string): Promise<LibraryBook[]> {
    return this.booksRepository
      .createQueryBuilder('book')
      .where('book.title LIKE :query', { query: `%${query}%` })
      .orWhere('book.author LIKE :query', { query: `%${query}%` })
      .orWhere('book.isbn LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async borrowBook(bookId: string, studentId: string): Promise<Borrowing> {
    const book = await this.booksRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.availableCopies <= 0) {
      throw new BadRequestException('Book is not available');
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days from now

    const borrowing = this.borrowingsRepository.create({
      bookId,
      studentId,
      borrowDate: new Date(),
      dueDate,
      status: 'borrowed',
    });

    book.availableCopies -= 1;
    await this.booksRepository.save(book);

    return this.borrowingsRepository.save(borrowing);
  }

  async getStudentBorrowings(studentId: string): Promise<Borrowing[]> {
    return this.borrowingsRepository.find({
      where: { studentId },
      relations: ['book'],
      order: { borrowDate: 'DESC' },
    });
  }

  async returnBook(borrowingId: string): Promise<Borrowing> {
    const borrowing = await this.borrowingsRepository.findOne({
      where: { id: borrowingId },
      relations: ['book'],
    });

    if (!borrowing) {
      throw new NotFoundException('Borrowing record not found');
    }

    borrowing.returnDate = new Date();
    borrowing.status = 'returned';

    const book = borrowing.book;
    book.availableCopies += 1;
    await this.booksRepository.save(book);

    return this.borrowingsRepository.save(borrowing);
  }
}

