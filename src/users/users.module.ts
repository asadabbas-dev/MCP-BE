import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { AssignmentSubmission } from '../assignments/entities/assignment-submission.entity';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';

/**
 * Users Module
 * 
 * Module for user management and authentication support.
 * Provides user service and controller.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Teacher, Course, Enrollment, AssignmentSubmission])],
  controllers: [UsersController],
  providers: [UsersService, StudentsService, TeachersService],
  exports: [UsersService], // Export for use in other modules
})
export class UsersModule {}

