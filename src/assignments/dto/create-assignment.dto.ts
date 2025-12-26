import { IsNotEmpty, IsString, IsInt, Min, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ description: 'Assignment title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Assignment description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Total marks', example: 100 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  totalMarks: number;

  @ApiProperty({ description: 'Due date (ISO string)', example: '2024-12-31T23:59:59Z' })
  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @ApiProperty({ description: 'Course ID' })
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'Semester', example: 'Fall 2024' })
  @IsNotEmpty()
  @IsString()
  semester: string;

  @ApiPropertyOptional({ description: 'Section (optional - leave empty for all sections)', example: 'A' })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiPropertyOptional({ description: 'Teacher ID (optional - will use current user if not provided)' })
  @IsOptional()
  @IsString()
  teacherId?: string;
}

