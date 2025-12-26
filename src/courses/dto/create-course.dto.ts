import { IsNotEmpty, IsString, IsInt, Min, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ description: 'Course code', example: 'CS201' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Course name', example: 'Data Structures' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Course description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Course syllabus content' })
  @IsOptional()
  @IsString()
  syllabus?: string;

  @ApiProperty({ description: 'Credit hours', example: 3 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  creditHours: number;

  @ApiProperty({ description: 'Semester', example: 'Fall 2024' })
  @IsNotEmpty()
  @IsString()
  semester: string;

  @ApiPropertyOptional({ description: 'Teacher ID (optional - will use current user if not provided)' })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ description: 'Is course active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

