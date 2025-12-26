import { IsNotEmpty, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GradeAssignmentDto {
  @ApiProperty({ description: 'Marks obtained', example: 85 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  marksObtained: number;

  @ApiPropertyOptional({ description: 'Teacher feedback' })
  @IsOptional()
  @IsString()
  feedback?: string;
}

