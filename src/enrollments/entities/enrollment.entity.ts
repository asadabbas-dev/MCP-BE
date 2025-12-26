import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';

/**
 * Enrollment Entity
 * 
 * Represents a student's enrollment in a course.
 * Links students to courses with section information.
 */
@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  section: string; // Section identifier (e.g., "A", "B", "Morning")

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  enrolledAt: Date;

  // Relationships
  @ManyToOne(() => Student, (student) => student.enrollments)
  @JoinColumn()
  student: Student;

  @Column()
  studentId: string; // Foreign key to students table

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn()
  course: Course;

  @Column()
  courseId: string; // Foreign key to courses table
}

