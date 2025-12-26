import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Auth Service
 * 
 * Service for authentication operations.
 * Handles login, registration, and JWT token generation.
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private studentsService: StudentsService,
    private teachersService: TeachersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials and return JWT token
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    // Get role-specific data
    let roleData = null;
    if (user.role === 'student' && user.student) {
      roleData = user.student;
    } else if (user.role === 'teacher' && user.teacher) {
      roleData = user.teacher;
    }

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profileImage: user.profileImage,
        ...roleData,
      },
    };
  }

  /**
   * Register new user (DISABLED)
   * Registration is disabled. Admins are created via database seeder.
   * Students and teachers must be created by admin using createStudent/createTeacher endpoints.
   */
  async register(registerDto: RegisterDto) {
    throw new BadRequestException('Registration is disabled. Please contact administrator.');
  }

  /**
   * Create student (Admin only)
   */
  async createStudent(createStudentDto: any) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(createStudentDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create user
    const user = await this.usersService.create({
      email: createStudentDto.email,
      password: createStudentDto.password,
      fullName: createStudentDto.fullName,
      role: 'student',
    });

    // Generate roll number if not provided
    let rollNumber = createStudentDto.rollNumber;
    if (!rollNumber) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-6);
      rollNumber = `STU-${year}${month}${day}-${timestamp}`;
    }

    // Create student record
    const student = await this.studentsService.create({
      userId: user.id,
      rollNumber,
      currentSemester: createStudentDto.currentSemester || 1,
      program: createStudentDto.program || 'BS Computer Science',
      enrollmentDate: new Date(),
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      rollNumber: student.rollNumber,
      currentSemester: student.currentSemester,
      program: student.program,
    };
  }

  /**
   * Create teacher (Admin only)
   */
  async createTeacher(createTeacherDto: any) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(createTeacherDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create user
    const user = await this.usersService.create({
      email: createTeacherDto.email,
      password: createTeacherDto.password,
      fullName: createTeacherDto.fullName,
      role: 'teacher',
    });

    // Generate employee ID if not provided
    let employeeId = createTeacherDto.employeeId;
    if (!employeeId) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-6);
      employeeId = `EMP-${year}${month}${day}-${timestamp}`;
    }

    // Create teacher record
    const teacher = await this.teachersService.create({
      userId: user.id,
      employeeId,
      department: createTeacherDto.department || 'Computer Science',
      designation: createTeacherDto.designation || 'Assistant Professor',
      joiningDate: new Date(),
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      employeeId: teacher.employeeId,
      department: teacher.department,
      designation: teacher.designation,
    };
  }

  /**
   * Request password reset (simulated - would send email in production)
   */
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists for security
      return { message: 'If email exists, reset link has been sent' };
    }

    // In production, generate reset token and send email
    // For now, just return success message
    return { message: 'If email exists, reset link has been sent' };
  }
}

