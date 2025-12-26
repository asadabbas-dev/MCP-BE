import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Notification title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ description: 'Notification type', enum: ['alert', 'info', 'warning'] })
  @IsNotEmpty()
  @IsEnum(['alert', 'info', 'warning'])
  type: 'alert' | 'info' | 'warning';

  @ApiProperty({ description: 'Target audience', enum: ['all', 'students', 'teachers'] })
  @IsNotEmpty()
  @IsEnum(['all', 'students', 'teachers'])
  targetAudience: 'all' | 'students' | 'teachers';

  @ApiPropertyOptional({ description: 'Course ID (optional)' })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({ description: 'Teacher ID (optional - will use current user if not provided)' })
  @IsOptional()
  @IsString()
  teacherId?: string;
}

