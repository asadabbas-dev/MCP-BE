import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { LibraryBook } from './library-book.entity';

/**
 * Borrowing Entity
 * 
 * Represents a student's book borrowing record.
 * Tracks borrow date, due date, and return date.
 */
@Entity('borrowings')
export class Borrowing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  borrowDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  returnDate: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'borrowed',
  })
  status: string; // 'borrowed', 'returned', 'overdue'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Student)
  @JoinColumn()
  student: Student;

  @Column()
  studentId: string; // Foreign key to students table

  @ManyToOne(() => LibraryBook, (book) => book.borrowings)
  @JoinColumn()
  book: LibraryBook;

  @Column()
  bookId: string; // Foreign key to library_books table
}

