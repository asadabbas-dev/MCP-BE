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

/**
 * Fee Entity
 * 
 * Represents a fee record for a student.
 * Tracks fee type, amount, due date, and payment status.
 */
@Entity('fees')
export class Fee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type: string; // 'tuition', 'lab', 'library', 'other'

  @Column()
  semester: string; // e.g., "Fall 2024"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Fee amount

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: string; // 'pending', 'paid', 'overdue'

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  @Column({ nullable: true })
  paymentMethod: string; // 'cash', 'bank_transfer', 'online'

  @Column({ nullable: true })
  transactionId: string; // Payment transaction ID

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Student, (student) => student.fees)
  @JoinColumn()
  student: Student;

  @Column()
  studentId: string; // Foreign key to students table
}

