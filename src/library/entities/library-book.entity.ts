import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Borrowing } from './borrowing.entity';

/**
 * Library Book Entity
 * 
 * Represents a book in the library catalog.
 * Tracks total copies and available copies.
 */
@Entity('library_books')
export class LibraryBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ unique: true })
  isbn: string; // International Standard Book Number

  @Column({ nullable: true })
  category: string; // Book category

  @Column({ type: 'int', default: 1 })
  totalCopies: number;

  @Column({ type: 'int', default: 1 })
  availableCopies: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Borrowing, (borrowing) => borrowing.book)
  borrowings: Borrowing[];
}

