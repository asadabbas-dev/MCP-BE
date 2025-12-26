import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({ description: 'Request type', enum: ['course_change', 'certificate', 'other'] })
  @IsNotEmpty()
  @IsEnum(['course_change', 'certificate', 'other'])
  type: string;

  @ApiProperty({ description: 'Request subject' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Request description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Student ID (optional - will use current user if not provided)' })
  @IsOptional()
  @IsString()
  studentId?: string;
}

