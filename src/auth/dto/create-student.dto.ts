import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Create Student DTO
 *
 * Data Transfer Object for creating a student by admin.
 * Only admins can create students.
 */
export class CreateStudentDto {
  @ApiProperty({
    description: "Student email address",
    example: "student@example.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description: "Student password (minimum 6 characters)",
    example: "password123",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password: string;

  @ApiProperty({
    description: "Student full name",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty({ message: "Full name is required" })
  fullName: string;

  @ApiPropertyOptional({
    description: "Student roll number (auto-generated if not provided)",
    example: "STU-20241223-123456",
  })
  @IsOptional()
  @IsString()
  rollNumber?: string;

  @ApiPropertyOptional({
    description: "Current semester (defaults to 1 if not provided)",
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  currentSemester?: number;

  @ApiPropertyOptional({
    description:
      'Degree program (defaults to "BS Computer Science" if not provided)',
    example: "BS Computer Science",
  })
  @IsOptional()
  @IsString()
  program?: string;
}
