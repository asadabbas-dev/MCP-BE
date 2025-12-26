import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Create Teacher DTO
 *
 * Data Transfer Object for creating a teacher by admin.
 * Only admins can create teachers.
 */
export class CreateTeacherDto {
  @ApiProperty({
    description: "Teacher email address",
    example: "teacher@example.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description: "Teacher password (minimum 6 characters)",
    example: "password123",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password: string;

  @ApiProperty({
    description: "Teacher full name",
    example: "Jane Smith",
  })
  @IsString()
  @IsNotEmpty({ message: "Full name is required" })
  fullName: string;

  @ApiPropertyOptional({
    description: "Employee ID (auto-generated if not provided)",
    example: "EMP-20241223-123456",
  })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({
    description: 'Department (defaults to "Computer Science" if not provided)',
    example: "Computer Science",
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    description:
      'Designation (defaults to "Assistant Professor" if not provided)',
    example: "Assistant Professor",
  })
  @IsOptional()
  @IsString()
  designation?: string;
}
