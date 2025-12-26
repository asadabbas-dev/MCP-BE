import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    if (!createEnrollmentDto.studentId) {
      throw new BadRequestException('Student ID is required');
    }
    // Check if already enrolled
    const existing = await this.enrollmentsRepository.findOne({
      where: {
        studentId: createEnrollmentDto.studentId,
        courseId: createEnrollmentDto.courseId,
        isActive: true,
      },
    });

    if (existing) {
      throw new BadRequestException('Student is already enrolled in this course');
    }

    const enrollment = this.enrollmentsRepository.create(createEnrollmentDto);
    return this.enrollmentsRepository.save(enrollment);
  }

  async findAll(semester?: string, section?: string, search?: string, isActive?: string): Promise<Enrollment[]> {
    const queryBuilder = this.enrollmentsRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('enrollment.course', 'course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser')
      .orderBy('enrollment.enrolledAt', 'DESC');

    if (semester) {
      queryBuilder.andWhere('course.semester = :semester', { semester });
    }

    if (section) {
      queryBuilder.andWhere('enrollment.section = :section', { section });
    }

    if (isActive !== undefined) {
      const active = isActive === 'true';
      queryBuilder.andWhere('enrollment.isActive = :isActive', { isActive: active });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.fullName ILIKE :search OR user.email ILIKE :search OR course.name ILIKE :search OR course.code ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    return queryBuilder.getMany();
  }

  async findByStudent(studentId: string): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      where: { studentId, isActive: true },
      relations: ['course', 'course.teacher', 'course.teacher.user'],
      order: { enrolledAt: 'DESC' },
    });
  }

  async findByCourse(courseId: string): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      where: { courseId, isActive: true },
      relations: ['student', 'student.user'],
      order: { enrolledAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: { id },
      relations: ['student', 'student.user', 'course', 'course.teacher'],
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return enrollment;
  }

  async remove(id: string, user?: any): Promise<void> {
    const enrollment = await this.findOne(id);
    
    // If user is provided and not admin, check if they own this enrollment
    if (user && user.role !== 'admin') {
      const studentId = user.studentId || user.student?.id;
      if (enrollment.studentId !== studentId) {
        throw new BadRequestException('You can only remove your own enrollments');
      }
    }
    
    enrollment.isActive = false;
    await this.enrollmentsRepository.save(enrollment);
  }
}

