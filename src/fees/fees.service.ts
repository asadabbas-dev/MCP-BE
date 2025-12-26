import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fee } from './entities/fee.entity';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(Fee)
    private feesRepository: Repository<Fee>,
  ) {}

  async findByStudent(studentId: string): Promise<Fee[]> {
    return this.feesRepository.find({
      where: { studentId },
      order: { dueDate: 'ASC' },
    });
  }

  async findPending(studentId: string): Promise<Fee[]> {
    return this.feesRepository.find({
      where: { studentId, status: 'pending' },
      order: { dueDate: 'ASC' },
    });
  }

  async findPaid(studentId: string): Promise<Fee[]> {
    return this.feesRepository.find({
      where: { studentId, status: 'paid' },
      order: { paidDate: 'DESC' },
    });
  }

  async payFee(id: string, paymentMethod: string, transactionId: string): Promise<Fee> {
    const fee = await this.feesRepository.findOne({ where: { id } });
    if (!fee) {
      throw new NotFoundException('Fee not found');
    }

    fee.status = 'paid';
    fee.paidDate = new Date();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;

    return this.feesRepository.save(fee);
  }
}

