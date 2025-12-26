import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostFoundItem } from './entities/lost-found-item.entity';

@Injectable()
export class LostFoundService {
  constructor(
    @InjectRepository(LostFoundItem)
    private itemsRepository: Repository<LostFoundItem>,
  ) {}

  async create(data: Partial<LostFoundItem>): Promise<LostFoundItem> {
    const item = this.itemsRepository.create(data);
    return this.itemsRepository.save(item);
  }

  async findAll(): Promise<LostFoundItem[]> {
    return this.itemsRepository.find({
      relations: ['reportedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: string): Promise<LostFoundItem[]> {
    return this.itemsRepository.find({
      where: { type },
      relations: ['reportedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LostFoundItem> {
    const item = await this.itemsRepository.findOne({
      where: { id },
      relations: ['reportedBy'],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async updateStatus(id: string, status: string): Promise<LostFoundItem> {
    const item = await this.findOne(id);
    item.status = status;
    return this.itemsRepository.save(item);
  }
}

