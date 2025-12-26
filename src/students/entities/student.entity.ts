import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { AssignmentSubmission } from '../../assignments/entities/assignment-submission.entity';
import { Grade } from '../../results/entities/grade.entity';
import { Request } from '../../requests/entities/request.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Fee } from '../../fees/entities/fee.entity';

/**
 * Student Entity
 * 
 * Stores student-specific information and academic details.
 * Linked to User entity for authentication.
 */
@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  rollNumber: string; // Unique student identifier

  @Column()
  currentSemester: number;

  @Column()
  program: string; // Degree program (e.g., "BS Computer Science")

  @Column({ type: 'date' })
  enrollmentDate: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  cgpa: number; // Cumulative GPA

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.student)
  @JoinColumn()
  user: User;

  @Column()
  userId: string; // Foreign key to users table

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => AssignmentSubmission, (submission) => submission.student)
  submissions: AssignmentSubmission[];

  @OneToMany(() => Grade, (grade) => grade.student)
  grades: Grade[];

  @OneToMany(() => Request, (request) => request.student)
  requests: Request[];

  @OneToMany(() => Feedback, (feedback) => feedback.student)
  feedbacks: Feedback[];

  @OneToMany(() => Fee, (fee) => fee.student)
  fees: Fee[];
}

