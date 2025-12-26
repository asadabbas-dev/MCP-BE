import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Update Teacher DTO
 * 
 * Data Transfer Object for updating teacher information.
 * All fields are optional.
 */
export class UpdateTeacherDto {
  @ApiPropertyOptional({
    description: 'Employee ID',
    example: 'EMP-2024-001',
  })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({
    description: 'Department',
    example: 'Computer Science',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    description: 'Designation',
    example: 'Assistant Professor',
  })
  @IsOptional()
  @IsString()
  designation?: string;
}

