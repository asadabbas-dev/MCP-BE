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
import { Course } from '../../courses/entities/course.entity';

/**
 * Grade Entity
 * 
 * Represents a student's grade for a course in a specific semester.
 * Used for calculating GPA and CGPA.
 */
@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  semester: string; // e.g., "Fall 2024"

  @Column({ type: 'int' })
  totalMarks: number;

  @Column({ type: 'int' })
  marksObtained: number;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  percentage: number;

  @Column({ type: 'varchar', length: 2 })
  letterGrade: string; // A, B, C, D, F

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  gradePoints: number; // GPA points (4.0, 3.5, etc.)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Student, (student) => student.grades)
  @JoinColumn()
  student: Student;

  @Column()
  studentId: string; // Foreign key to students table

  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course;

  @Column()
  courseId: string; // Foreign key to courses table
}

