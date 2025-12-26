import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

/**
 * Feedback Entity
 * 
 * Represents feedback submitted by students.
 * Can be about teachers, courses, or the system.
 */
@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  targetType: string; // 'teacher', 'course', 'system'

  @Column()
  targetId: string; // ID of teacher, course, or 'system'

  @Column({ type: 'varchar', length: 100, nullable: true })
  targetName: string; // Name of teacher or course

  @Column({ type: 'int' })
  rating: number; // 1-5 star rating

  @Column({ type: 'text' })
  comment: string; // Feedback text

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Student, (student) => student.feedbacks)
  @JoinColumn()
  student: Student;

  @Column()
  studentId: string; // Foreign key to students table
}

