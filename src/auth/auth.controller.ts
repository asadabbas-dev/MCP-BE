import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

/**
 * Auth Controller
 * 
 * Controller for authentication endpoints.
 * Handles login, registration, and password reset.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User login
   * POST /api/auth/login
   */
  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Authenticate user and receive JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT token and user data' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * User registration (DISABLED)
   * POST /api/auth/register
   * Note: Registration is disabled. Admins are created via database seeder.
   * Students and teachers must be created by admin using /create-student and /create-teacher endpoints.
   */
  @Post('register')
  @ApiOperation({ 
    summary: 'User registration (Disabled)', 
    description: 'Registration is disabled. Admins are created via database seeder. Students and teachers must be created by admin.' 
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 400, description: 'Registration is disabled' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Create student (Admin only)
   * POST /api/auth/create-student
   */
  @Post('create-student')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create student (Admin only)', description: 'Admin endpoint to create a new student account' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - user already exists or validation failed' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.authService.createStudent(createStudentDto);
  }

  /**
   * Create teacher (Admin only)
   * POST /api/auth/create-teacher
   */
  @Post('create-teacher')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create teacher (Admin only)', description: 'Admin endpoint to create a new teacher account' })
  @ApiBody({ type: CreateTeacherDto })
  @ApiResponse({ status: 201, description: 'Teacher created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - user already exists or validation failed' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.authService.createTeacher(createTeacherDto);
  }

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset', description: 'Request password reset link via email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset link sent (if email exists)' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }
}

