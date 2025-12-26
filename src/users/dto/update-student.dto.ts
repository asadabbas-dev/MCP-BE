import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Update Student DTO
 * 
 * Data Transfer Object for updating student information.
 * All fields are optional.
 */
export class UpdateStudentDto {
  @ApiPropertyOptional({
    description: 'Student roll number',
    example: 'STU-2024-001',
  })
  @IsOptional()
  @IsString()
  rollNumber?: string;

  @ApiPropertyOptional({
    description: 'Current semester',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  currentSemester?: number;

  @ApiPropertyOptional({
    description: 'Degree program',
    example: 'BS Computer Science',
  })
  @IsOptional()
  @IsString()
  program?: string;
}

