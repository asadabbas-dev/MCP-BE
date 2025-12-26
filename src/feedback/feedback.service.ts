import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    if (!createFeedbackDto.studentId) {
      throw new BadRequestException('Student ID is required');
    }
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      relations: ['student', 'student.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(targetType: string): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      where: { targetType },
      relations: ['student', 'student.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTarget(targetId: string): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      where: { targetId },
      relations: ['student', 'student.user'],
      order: { createdAt: 'DESC' },
    });
  }
}

