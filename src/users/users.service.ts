import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { AssignmentSubmission } from '../assignments/entities/assignment-submission.entity';
import * as bcrypt from 'bcrypt';

/**
 * Users Service
 * 
 * Service for user management operations.
 * Handles user creation, retrieval, and password operations.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(AssignmentSubmission)
    private submissionsRepository: Repository<AssignmentSubmission>,
  ) {}

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['student', 'teacher'],
    });
  }

  /**
   * Find user by ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['student', 'teacher'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Create new user
   */
  async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  /**
   * Update user
   */
  async update(id: string, updateData: Partial<User>): Promise<User> {
    // Hash password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Find users by role with optional search and filters
   */
  async findByRole(
    role: string,
    search?: string,
    filters?: {
      currentSemester?: string;
      program?: string;
      department?: string;
      designation?: string;
    },
  ): Promise<User[]> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('user.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser')
      .where('user.role = :role', { role })
      .orderBy('user.createdAt', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        '(user.fullName ILIKE :search OR user.email ILIKE :search OR student.rollNumber ILIKE :search OR teacher.employeeId ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Student filters
    if (role === 'student' && filters) {
      if (filters.currentSemester) {
        const semesterNum = parseInt(filters.currentSemester, 10);
        if (!isNaN(semesterNum)) {
          queryBuilder.andWhere('student.currentSemester = :currentSemester', {
            currentSemester: semesterNum,
          });
        }
      }
      if (filters.program) {
        queryBuilder.andWhere('student.program = :program', {
          program: filters.program,
        });
      }
    }

    // Teacher filters
    if (role === 'teacher' && filters) {
      if (filters.department) {
        queryBuilder.andWhere('teacher.department = :department', {
          department: filters.department,
        });
      }
      if (filters.designation) {
        queryBuilder.andWhere('teacher.designation = :designation', {
          designation: filters.designation,
        });
      }
    }

    return queryBuilder.getMany();
  }

  /**
   * Find all users (Admin only) with optional search
   */
  async findAll(search?: string): Promise<User[]> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('user.teacher', 'teacher')
      .orderBy('user.createdAt', 'DESC');

    if (search) {
      queryBuilder.where(
        '(user.fullName ILIKE :search OR user.email ILIKE :search OR student.rollNumber ILIKE :search OR teacher.employeeId ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return queryBuilder.getMany();
  }

  /**
   * Validate password
   */
  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Delete user (Admin only)
   * Also deletes associated student/teacher records
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (user.student) {
      // Student deletion will be handled by cascade or manually
    }
    if (user.teacher) {
      // Teacher deletion will be handled by cascade or manually
    }
    await this.usersRepository.delete(id);
  }

  /**
   * Get admin dashboard statistics
   */
  async getAdminStats() {
    const [students, teachers, courses, activeUsers] = await Promise.all([
      this.usersRepository.count({ where: { role: 'student' } }),
      this.usersRepository.count({ where: { role: 'teacher' } }),
      this.coursesRepository.count(),
      this.usersRepository.count({ where: { isActive: true } }),
    ]);

    return {
      totalStudents: students,
      totalTeachers: teachers,
      totalCourses: courses,
      activeUsers: activeUsers,
    };
  }

  /**
   * Get teacher dashboard statistics
   * Returns assigned courses count, total students, pending submissions, etc.
   */
  async getTeacherStats(teacherId: string) {
    // Get all courses assigned to this teacher
    const courses = await this.coursesRepository.find({
      where: { teacherId, isActive: true },
      relations: ['enrollments'],
    });

    // Count total students across all courses
    const courseIds = courses.map((c) => c.id);
    const totalStudents = courseIds.length > 0
      ? await this.enrollmentsRepository.count({
          where: { courseId: In(courseIds), isActive: true },
        })
      : 0;

    // Count pending submissions (submissions without grades)
    // Note: This requires joining with assignments table, simplified for now
    const pendingSubmissions = courseIds.length > 0
      ? await this.submissionsRepository
          .createQueryBuilder('submission')
          .innerJoin('submission.assignment', 'assignment')
          .where('assignment.courseId IN (:...courseIds)', { courseIds })
          .andWhere('submission.marksObtained IS NULL')
          .getCount()
      : 0;

    // Count ungraded submissions (submissions that need grading)
    const ungradedSubmissions = pendingSubmissions; // Same as pending for now

    // Count pending requests (if requests module exists)
    // For now, return 0
    const pendingRequests = 0;

    return {
      assignedCourses: courses.length,
      totalStudents,
      pendingSubmissions,
      ungradedSubmissions,
      pendingRequests,
    };
  }
}

