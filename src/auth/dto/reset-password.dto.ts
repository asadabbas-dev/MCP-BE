import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Reset Password DTO
 * 
 * Data Transfer Object for password reset.
 * Validates new password input.
 */
export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

