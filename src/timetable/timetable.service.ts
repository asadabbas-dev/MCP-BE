import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './entities/timetable.entity';
import { CreateTimetableDto } from './dto/create-timetable.dto';

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable)
    private timetableRepository: Repository<Timetable>,
  ) {}

  async create(createTimetableDto: CreateTimetableDto): Promise<Timetable> {
    const timetable = this.timetableRepository.create(createTimetableDto);
    return this.timetableRepository.save(timetable);
  }

  async findBySemester(
    semester?: string,
    search?: string,
    courseId?: string,
    teacherId?: string,
  ): Promise<Timetable[]> {
    const queryBuilder = this.timetableRepository
      .createQueryBuilder('timetable')
      .leftJoinAndSelect('timetable.course', 'course')
      .leftJoinAndSelect('timetable.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser')
      .orderBy('timetable.dayOfWeek', 'ASC')
      .addOrderBy('timetable.startTime', 'ASC');

    if (semester) {
      queryBuilder.where('timetable.semester = :semester', { semester });
    }

    if (courseId) {
      if (semester) {
        queryBuilder.andWhere('timetable.courseId = :courseId', { courseId });
      } else {
        queryBuilder.where('timetable.courseId = :courseId', { courseId });
      }
    }

    if (teacherId) {
      if (semester || courseId) {
        queryBuilder.andWhere('timetable.teacherId = :teacherId', { teacherId });
      } else {
        queryBuilder.where('timetable.teacherId = :teacherId', { teacherId });
      }
    }

    if (search) {
      const searchCondition = '(course.name ILIKE :search OR course.code ILIKE :search OR timetable.room ILIKE :search OR teacherUser.fullName ILIKE :search)';
      if (semester || courseId || teacherId) {
        queryBuilder.andWhere(searchCondition, { search: `%${search}%` });
      } else {
        queryBuilder.where(searchCondition, { search: `%${search}%` });
      }
    }

    return queryBuilder.getMany();
  }

  async findByCourse(courseId: string): Promise<Timetable[]> {
    return this.timetableRepository.find({
      where: { courseId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Timetable> {
    const timetable = await this.timetableRepository.findOne({
      where: { id },
      relations: ['course', 'teacher', 'teacher.user'],
    });
    if (!timetable) {
      throw new NotFoundException(`Timetable entry with ID ${id} not found`);
    }
    return timetable;
  }

  async update(id: string, updateData: Partial<CreateTimetableDto>): Promise<Timetable> {
    await this.timetableRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.timetableRepository.delete(id);
  }
}

