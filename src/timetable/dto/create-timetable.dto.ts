import { IsNotEmpty, IsString, IsEnum, IsTimeZone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimetableDto {
  @ApiProperty({ description: 'Course ID' })
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'Teacher ID - specifies which teacher teaches this course in this time slot' })
  @IsNotEmpty()
  @IsString()
  teacherId: string;

  @ApiProperty({ description: 'Day of week', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] })
  @IsNotEmpty()
  @IsEnum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
  dayOfWeek: string;

  @ApiProperty({ description: 'Start time (HH:MM format)', example: '09:00' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ description: 'End time (HH:MM format)', example: '10:30' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ description: 'Room number', example: 'A-101' })
  @IsNotEmpty()
  @IsString()
  room: string;

  @ApiProperty({ description: 'Semester', example: 'Fall 2024' })
  @IsNotEmpty()
  @IsString()
  semester: string;
}

