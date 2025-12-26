import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Student } from "../../students/entities/student.entity";
import { Teacher } from "../../teachers/entities/teacher.entity";

/**
 * User Entity
 *
 * Base user entity for authentication and user management.
 * Supports both Student and Teacher roles through one-to-one relationships.
 */
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed password

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  profileImage: string; // URL or path to profile image

  @Column({
    type: "varchar",
    length: 20,
    default: "student",
  })
  role: string; // 'student', 'teacher', or 'admin'

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToOne(() => Student, (student) => student.user, { nullable: true })
  student: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user, { nullable: true })
  teacher: Teacher;
}
