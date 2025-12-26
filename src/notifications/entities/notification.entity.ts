import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Course } from '../../courses/entities/course.entity';

/**
 * Notification Entity
 * 
 * Represents a notification created by teachers or system.
 * Can be targeted to all users, students only, or teachers only.
 */
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'info',
  })
  type: string; // 'alert', 'info', 'warning'

  @Column({
    type: 'varchar',
    length: 20,
    default: 'all',
  })
  targetAudience: string; // 'all', 'students', 'teachers'

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Teacher, (teacher) => teacher.notifications, { nullable: true })
  @JoinColumn()
  teacher: Teacher;

  @Column({ nullable: true })
  teacherId: string; // Foreign key to teachers table (nullable for system notifications)

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn()
  course: Course;

  @Column({ nullable: true })
  courseId: string; // Foreign key to courses table (nullable for general notifications)
}

