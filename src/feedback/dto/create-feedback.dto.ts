import { IsNotEmpty, IsString, IsInt, Min, Max, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({ description: 'Target type', enum: ['teacher', 'course', 'system'] })
  @IsNotEmpty()
  @IsEnum(['teacher', 'course', 'system'])
  targetType: string;

  @ApiProperty({ description: 'Target ID' })
  @IsNotEmpty()
  @IsString()
  targetId: string;

  @ApiProperty({ description: 'Target name', required: false })
  @IsString()
  targetName?: string;

  @ApiProperty({ description: 'Rating (1-5)', example: 5 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Feedback comment' })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiPropertyOptional({ description: 'Student ID (optional - will use current user if not provided)' })
  @IsOptional()
  @IsString()
  studentId?: string;
}

