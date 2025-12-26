import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
  IsNumber,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Register DTO
 *
 * Data Transfer Object for user registration.
 * Validates all required fields for creating a new user account.
 */
export class RegisterDto {
  @ApiProperty({
    description: "User email address",
    example: "student@example.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description: "User password (minimum 6 characters)",
    example: "password123",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password: string;

  @ApiProperty({
    description: "User full name",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty({ message: "Full name is required" })
  fullName: string;

  @ApiProperty({
    description: 'User role (only "admin" allowed for registration)',
    example: "admin",
    enum: ["admin"],
  })
  @IsEnum(["admin"], {
    message:
      "Only admin registration is allowed. Students and teachers must be created by admin.",
  })
  @IsNotEmpty({ message: "Role is required" })
  role: "admin";

  // Student-specific fields (optional - will be auto-generated if not provided)
  @ApiPropertyOptional({
    description:
      "Student roll number (optional - auto-generated if not provided)",
    example: "STU-20241223-123456",
  })
  @IsOptional()
  @IsString()
  rollNumber?: string;

  @ApiPropertyOptional({
    description: "Current semester (optional - defaults to 1 if not provided)",
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  currentSemester?: number;

  @ApiPropertyOptional({
    description:
      'Degree program (optional - defaults to "BS Computer Science" if not provided)',
    example: "BS Computer Science",
  })
  @IsOptional()
  @IsString()
  program?: string;

  // Teacher-specific fields (optional - will be auto-generated if not provided)
  @ApiPropertyOptional({
    description: "Employee ID (optional - auto-generated if not provided)",
    example: "EMP-20241223-123456",
  })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({
    description:
      'Department (optional - defaults to "Computer Science" if not provided)',
    example: "Computer Science",
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    description:
      'Designation (optional - defaults to "Assistant Professor" if not provided)',
    example: "Assistant Professor",
  })
  @IsOptional()
  @IsString()
  designation?: string;
}
