import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

/**
 * Timetable Entity
 * 
 * Represents a class schedule entry in the timetable.
 * Links courses to specific days, times, rooms, and teachers.
 * Each entry explicitly specifies which teacher teaches which course in which semester.
 */
@Entity('timetable')
export class Timetable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
  })
  dayOfWeek: string; // Monday, Tuesday, etc.

  @Column({ type: 'time' })
  startTime: string; // e.g., "09:00"

  @Column({ type: 'time' })
  endTime: string; // e.g., "10:30"

  @Column()
  room: string; // Room number or location

  @Column()
  semester: string; // e.g., "Fall 2024"

  // Relationships
  @ManyToOne(() => Course, (course) => course.timetables)
  @JoinColumn()
  course: Course;

  @Column()
  courseId: string; // Foreign key to courses table

  @ManyToOne(() => Teacher)
  @JoinColumn()
  teacher: Teacher;

  @Column()
  teacherId: string; // Foreign key to teachers table - specifies which teacher teaches this course in this time slot
}

