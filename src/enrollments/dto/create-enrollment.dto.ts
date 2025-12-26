import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiPropertyOptional({ description: 'Student ID (optional - will use current user if not provided)' })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiProperty({ description: 'Course ID' })
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'Section', example: 'A' })
  @IsNotEmpty()
  @IsString()
  section: string;
}

