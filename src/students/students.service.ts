import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "./entities/student.entity";

/**
 * Students Service
 *
 * Service for student management operations.
 */
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>
  ) {}

  /**
   * Create new student
   */
  async create(studentData: Partial<Student>): Promise<Student> {
    const student = this.studentsRepository.create(studentData);
    return this.studentsRepository.save(student);
  }

  /**
   * Find student by user ID
   */
  async findByUserId(userId: string): Promise<Student | null> {
    return this.studentsRepository.findOne({
      where: { userId },
      relations: ["user"],
    });
  }

  /**
   * Find student by ID
   */
  async findOne(id: string): Promise<Student> {
    return this.studentsRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  /**
   * Update student
   */
  async update(id: string, updateData: Partial<Student>): Promise<Student> {
    await this.studentsRepository.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Delete student
   */
  async remove(id: string): Promise<void> {
    await this.studentsRepository.delete(id);
  }
}
