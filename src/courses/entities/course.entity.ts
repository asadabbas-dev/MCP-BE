import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Teacher } from "../../teachers/entities/teacher.entity";
import { Enrollment } from "../../enrollments/entities/enrollment.entity";
import { Assignment } from "../../assignments/entities/assignment.entity";
import { Timetable } from "../../timetable/entities/timetable.entity";

/**
 * Course Entity
 *
 * Represents a course offered in the university.
 * Each course is assigned to a teacher and can have multiple enrollments.
 */
@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  code: string; // Course code (e.g., "CS201")

  @Column()
  name: string; // Course name

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  syllabus: string; // Course syllabus content

  @Column({ type: "int" })
  creditHours: number;

  @Column()
  semester: string; // e.g., "Fall 2024", "Spring 2024"

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn()
  teacher: Teacher;

  @Column()
  teacherId: string; // Foreign key to teachers table

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => Assignment, (assignment) => assignment.course)
  assignments: Assignment[];

  @OneToMany(() => Timetable, (timetable) => timetable.course)
  timetables: Timetable[];
}
