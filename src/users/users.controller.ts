import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

/**
 * Users Controller
 * 
 * Controller for user-related endpoints.
 * Handles user profile and information retrieval.
 */
@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
  ) {}

  /**
   * Get current user profile
   * Protected route - requires authentication
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile', description: 'Retrieve authenticated user profile information' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  /**
   * Update current user profile
   * PATCH /api/users/profile
   */
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile', description: 'Update authenticated user profile information' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Update user basic info
    const updateData: any = {};
    if (updateUserDto.fullName) updateData.fullName = updateUserDto.fullName;
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.phone !== undefined) updateData.phone = updateUserDto.phone;
    if (updateUserDto.address !== undefined) updateData.address = updateUserDto.address;
    if (updateUserDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateUserDto.dateOfBirth);
    }
    if (updateUserDto.password) updateData.password = updateUserDto.password;

    if (Object.keys(updateData).length > 0) {
      await this.usersService.update(user.id, updateData);
    }

    return this.usersService.findOne(user.id);
  }

  /**
   * Get users by role (Admin only)
   * GET /api/users?role=student|teacher|admin&search=query
   */
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get users by role (Admin only)', description: 'Retrieve users filtered by role with optional search and filters. Admin access required.' })
  @ApiQuery({ name: 'role', required: false, description: 'Filter by role (student, teacher, admin)' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, email, rollNumber, or employeeId' })
  @ApiQuery({ name: 'currentSemester', required: false, description: 'Filter students by current semester' })
  @ApiQuery({ name: 'program', required: false, description: 'Filter students by program' })
  @ApiQuery({ name: 'department', required: false, description: 'Filter teachers by department' })
  @ApiQuery({ name: 'designation', required: false, description: 'Filter teachers by designation' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getUsers(
    @Query('role') role?: string,
    @Query('search') search?: string,
    @Query('currentSemester') currentSemester?: string,
    @Query('program') program?: string,
    @Query('department') department?: string,
    @Query('designation') designation?: string,
  ) {
    if (role) {
      const filters = {
        currentSemester,
        program,
        department,
        designation,
      };
      return this.usersService.findByRole(role, search, filters);
    }
    return this.usersService.findAll(search);
  }

  /**
   * Get admin dashboard statistics (Admin only)
   * GET /api/users/admin/stats
   */
  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get admin dashboard statistics (Admin only)', description: 'Retrieve statistics for admin dashboard. Admin access required.' })
  @ApiResponse({ status: 200, description: 'Admin statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAdminStats() {
    return this.usersService.getAdminStats();
  }

  /**
   * Get teacher dashboard statistics (Teacher only)
   * GET /api/users/teacher/stats
   */
  @Get('teacher/stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get teacher dashboard statistics (Teacher only)', description: 'Retrieve statistics for teacher dashboard including assigned courses, total students, pending submissions, etc.' })
  @ApiResponse({ status: 200, description: 'Teacher statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTeacherStats(@CurrentUser() user: User) {
    if (user.role !== 'teacher' || !user.teacher) {
      throw new Error('Teacher access required');
    }
    return this.usersService.getTeacherStats(user.teacher.id);
  }

  /**
   * Get user by ID (Admin only)
   * GET /api/users/:id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get user by ID (Admin only)', description: 'Retrieve user details by ID. Admin access required.' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Update user (Admin only)
   * PATCH /api/users/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update user (Admin only)', description: 'Update user information. Admin access required.' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findOne(id);
    
    // Update user basic info
    const updateData: any = {};
    if (updateUserDto.fullName) updateData.fullName = updateUserDto.fullName;
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.phone) updateData.phone = updateUserDto.phone;
    if (updateUserDto.password) updateData.password = updateUserDto.password;

    if (Object.keys(updateData).length > 0) {
      await this.usersService.update(id, updateData);
    }

    return this.usersService.findOne(id);
  }

  /**
   * Update student (Admin only)
   * PATCH /api/users/:id/student
   */
  @Patch(':id/student')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update student (Admin only)', description: 'Update student-specific information. Admin access required.' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async updateStudent(
    @Param('id') userId: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const user = await this.usersService.findOne(userId);
    if (!user.student) {
      throw new Error('User is not a student');
    }
    await this.studentsService.update(user.student.id, updateStudentDto);
    return this.usersService.findOne(userId);
  }

  /**
   * Update teacher (Admin only)
   * PATCH /api/users/:id/teacher
   */
  @Patch(':id/teacher')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update teacher (Admin only)', description: 'Update teacher-specific information. Admin access required.' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async updateTeacher(
    @Param('id') userId: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    const user = await this.usersService.findOne(userId);
    if (!user.teacher) {
      throw new Error('User is not a teacher');
    }
    await this.teachersService.update(user.teacher.id, updateTeacherDto);
    return this.usersService.findOne(userId);
  }

  /**
   * Delete user (Admin only)
   * DELETE /api/users/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete user (Admin only)', description: 'Delete a user and associated records. Admin access required.' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    
    // Delete associated student/teacher records
    if (user.student) {
      await this.studentsService.remove(user.student.id);
    }
    if (user.teacher) {
      await this.teachersService.remove(user.teacher.id);
    }
    
    // Delete user
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}

