import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersService } from './teachers.service';
import { Teacher } from './entities/teacher.entity';

/**
 * Teachers Module
 * 
 * Module for teacher management.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Teacher])],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}

