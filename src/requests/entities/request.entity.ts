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
import { User } from '../../users/entities/user.entity';

/**
 * Request Entity
 * 
 * Represents a student's request to faculty or administration.
 * Can be for course changes, certificates, or other purposes.
 */
@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type: string; // 'course_change', 'certificate', 'other'

  @Column()
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: string; // 'pending', 'in_progress', 'resolved', 'rejected'

  @Column({ type: 'text', nullable: true })
  response: string; // Teacher's response

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Student, (student) => student.requests)
  @JoinColumn()
  student: Student;

  @Column()
  studentId: string; // Foreign key to students table

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  handledBy: User; // Teacher who handled the request

  @Column({ nullable: true })
  handledById: string; // Foreign key to users table
}

