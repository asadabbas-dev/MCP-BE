import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty({ description: 'Student ID' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Course ID' })
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'Semester', example: 'Fall 2024' })
  @IsNotEmpty()
  @IsString()
  semester: string;

  @ApiProperty({ description: 'Total marks', example: 100 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  totalMarks: number;

  @ApiProperty({ description: 'Marks obtained', example: 85 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  marksObtained: number;
}

