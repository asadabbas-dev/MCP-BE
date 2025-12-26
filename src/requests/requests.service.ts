import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { RespondRequestDto } from './dto/respond-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
  ) {}

  async create(createRequestDto: CreateRequestDto): Promise<Request> {
    if (!createRequestDto.studentId) {
      throw new BadRequestException('Student ID is required');
    }
    const request = this.requestsRepository.create(createRequestDto);
    return this.requestsRepository.save(request);
  }

  async findAll(): Promise<Request[]> {
    return this.requestsRepository.find({
      relations: ['student', 'student.user', 'handledBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStudent(studentId: string): Promise<Request[]> {
    return this.requestsRepository.find({
      where: { studentId },
      relations: ['student', 'student.user', 'handledBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<Request[]> {
    return this.requestsRepository.find({
      where: { status },
      relations: ['student', 'student.user', 'handledBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.requestsRepository.findOne({
      where: { id },
      relations: ['student', 'student.user', 'handledBy'],
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return request;
  }

  async respond(id: string, userId: string, respondDto: RespondRequestDto): Promise<Request> {
    const request = await this.findOne(id);
    request.response = respondDto.response;
    request.status = respondDto.status;
    request.handledById = userId;
    return this.requestsRepository.save(request);
  }
}

