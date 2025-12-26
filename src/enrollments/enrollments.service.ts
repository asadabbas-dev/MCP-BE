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

  async findAll(): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      relations: ['student', 'student.user', 'course', 'course.teacher'],
      order: { enrolledAt: 'DESC' },
    });
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

  async remove(id: string): Promise<void> {
    const enrollment = await this.findOne(id);
    enrollment.isActive = false;
    await this.enrollmentsRepository.save(enrollment);
  }
}

