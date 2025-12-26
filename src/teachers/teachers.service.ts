import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Teacher } from "./entities/teacher.entity";

/**
 * Teachers Service
 *
 * Service for teacher management operations.
 */
@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>
  ) {}

  /**
   * Create new teacher
   */
  async create(teacherData: Partial<Teacher>): Promise<Teacher> {
    const teacher = this.teachersRepository.create(teacherData);
    return this.teachersRepository.save(teacher);
  }

  /**
   * Find teacher by user ID
   */
  async findByUserId(userId: string): Promise<Teacher | null> {
    return this.teachersRepository.findOne({
      where: { userId },
      relations: ["user"],
    });
  }

  /**
   * Find teacher by ID
   */
  async findOne(id: string): Promise<Teacher> {
    return this.teachersRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  /**
   * Update teacher
   */
  async update(id: string, updateData: Partial<Teacher>): Promise<Teacher> {
    await this.teachersRepository.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Delete teacher
   */
  async remove(id: string): Promise<void> {
    await this.teachersRepository.delete(id);
  }
}
