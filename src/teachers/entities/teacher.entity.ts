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
import { Course } from '../../courses/entities/course.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';
import { Notification } from '../../notifications/entities/notification.entity';

/**
 * Teacher Entity
 * 
 * Stores teacher-specific information and professional details.
 * Linked to User entity for authentication.
 */
@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  employeeId: string; // Unique employee identifier

  @Column()
  department: string; // Academic department

  @Column()
  designation: string; // Job title (e.g., "Associate Professor")

  @Column({ type: 'date' })
  joiningDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.teacher)
  @JoinColumn()
  user: User;

  @Column()
  userId: string; // Foreign key to users table

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @OneToMany(() => Assignment, (assignment) => assignment.teacher)
  assignments: Assignment[];

  @OneToMany(() => Notification, (notification) => notification.teacher)
  notifications: Notification[];
}

