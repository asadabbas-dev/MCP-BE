import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { TeacherGuard } from '../common/guards/teacher.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new course (Admin only)' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  create(@Body() createCourseDto: CreateCourseDto) {
    // Admin must provide teacherId when creating course
    if (!createCourseDto.teacherId) {
      throw new Error('Teacher ID is required when creating a course.');
    }
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiQuery({ name: 'semester', required: false, description: 'Filter by semester' })
  @ApiQuery({ name: 'teacherId', required: false, description: 'Filter by teacher ID' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by course name, code, or teacher name' })
  @ApiResponse({ status: 200, description: 'List of courses' })
  findAll(@Query('semester') semester?: string, @Query('teacherId') teacherId?: string, @Query('search') search?: string) {
    return this.coursesService.findAll(search, semester, teacherId);
  }

  /**
   * Get teacher's assigned courses with student count
   * GET /api/courses/teacher/my-courses
   */
  @Get('teacher/my-courses')
  @UseGuards(JwtAuthGuard, TeacherGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get teacher\'s assigned courses (Teacher only)', description: 'Retrieve all courses assigned to the authenticated teacher with student enrollment count' })
  @ApiResponse({ status: 200, description: 'List of teacher courses with student counts' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher access required' })
  async getMyCourses(@CurrentUser() user: User) {
    return this.coursesService.findByTeacherWithStudentCount(user.teacher.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiResponse({ status: 200, description: 'Course details' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update course (Admin only)' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete course (Admin only)' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}

