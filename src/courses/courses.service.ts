import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    if (!createCourseDto.teacherId) {
      throw new BadRequestException('Teacher ID is required');
    }
    const course = this.coursesRepository.create(createCourseDto);
    return this.coursesRepository.save(course);
  }

  async findAll(search?: string, semester?: string, teacherId?: string): Promise<Course[]> {
    const queryBuilder = this.coursesRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .orderBy('course.createdAt', 'DESC');

    if (semester) {
      queryBuilder.where('course.semester = :semester', { semester });
    }

    if (teacherId) {
      if (semester) {
        queryBuilder.andWhere('course.teacherId = :teacherId', { teacherId });
      } else {
        queryBuilder.where('course.teacherId = :teacherId', { teacherId });
      }
    }

    if (search) {
      const searchCondition = '(course.name ILIKE :search OR course.code ILIKE :search OR user.fullName ILIKE :search)';
      if (semester || teacherId) {
        queryBuilder.andWhere(searchCondition, { search: `%${search}%` });
      } else {
        queryBuilder.where(searchCondition, { search: `%${search}%` });
      }
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['teacher', 'teacher.user', 'enrollments', 'enrollments.student'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async findByTeacher(teacherId: string): Promise<Course[]> {
    return this.coursesRepository.find({
      where: { teacherId },
      relations: ['teacher', 'teacher.user', 'enrollments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySemester(semester: string): Promise<Course[]> {
    return this.coursesRepository.find({
      where: { semester, isActive: true },
      relations: ['teacher', 'teacher.user'],
      order: { code: 'ASC' },
    });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return this.coursesRepository.save(course);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await this.coursesRepository.remove(course);
  }
}

