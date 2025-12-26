import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Course } from '../../courses/entities/course.entity';
import { AssignmentSubmission } from './assignment-submission.entity';

/**
 * Assignment Entity
 * 
 * Represents an assignment created by a teacher for a course.
 * Contains assignment details, deadline, and total marks.
 */
@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  totalMarks: number;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Teacher, (teacher) => teacher.assignments)
  @JoinColumn()
  teacher: Teacher;

  @Column()
  teacherId: string; // Foreign key to teachers table

  @ManyToOne(() => Course, (course) => course.assignments)
  @JoinColumn()
  course: Course;

  @Column()
  courseId: string; // Foreign key to courses table

  @OneToMany(() => AssignmentSubmission, (submission) => submission.assignment)
  submissions: AssignmentSubmission[];
}

