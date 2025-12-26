import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    if (!createNotificationDto.teacherId) {
      throw new BadRequestException('Teacher ID is required');
    }
    const notification = this.notificationsRepository.create(createNotificationDto);
    return this.notificationsRepository.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationsRepository.find({
      relations: ['teacher', 'teacher.user', 'course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTarget(targetAudience: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { targetAudience },
      relations: ['teacher', 'teacher.user', 'course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTeacher(teacherId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { teacherId },
      relations: ['teacher', 'teacher.user', 'course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
      relations: ['teacher', 'teacher.user', 'course'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userRole: string): Promise<void> {
    const targetAudience = userRole === 'student' ? 'students' : 'teachers';
    await this.notificationsRepository.update(
      { targetAudience, isRead: false },
      { isRead: true },
    );
  }

  async remove(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationsRepository.remove(notification);
  }
}

