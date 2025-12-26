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
import { Assignment } from './assignment.entity';

/**
 * Assignment Submission Entity
 * 
 * Represents a student's submission for an assignment.
 * Contains submission file, comments, marks, and feedback.
 */
@Entity('assignment_submissions')
export class AssignmentSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  fileUrl: string; // Path or URL to submitted file

  @Column({ nullable: true })
  fileName: string; // Original file name

  @Column({ type: 'text', nullable: true })
  comments: string; // Student's submission comments

  @Column({ type: 'int', nullable: true })
  marksObtained: number; // Marks given by teacher

  @Column({ type: 'text', nullable: true })
  feedback: string; // Teacher's feedback

  @Column({ default: false })
  isGraded: boolean;

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Student, (student) => student.submissions)
  @JoinColumn()
  student: Student;

  @Column()
  studentId: string; // Foreign key to students table

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions)
  @JoinColumn()
  assignment: Assignment;

  @Column()
  assignmentId: string; // Foreign key to assignments table
}

