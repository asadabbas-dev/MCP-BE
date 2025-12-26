import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StudentGuard } from '../common/guards/student.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enroll student in course (Student only)' })
  @ApiResponse({ status: 201, description: 'Enrollment created successfully' })
  @ApiResponse({ status: 400, description: 'Already enrolled or bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  create(@CurrentUser() user: any, @Body() createEnrollmentDto: CreateEnrollmentDto) {
    const studentId = user.studentId || user.student?.id;
    if (!studentId) {
      throw new BadRequestException('Student ID not found. Only students can enroll in courses.');
    }
    return this.enrollmentsService.create({ ...createEnrollmentDto, studentId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all enrollments' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'courseId', required: false })
  @ApiQuery({ name: 'semester', required: false })
  @ApiQuery({ name: 'section', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiResponse({ status: 200, description: 'List of enrollments' })
  findAll(
    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string,
    @Query('semester') semester?: string,
    @Query('section') section?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    if (studentId) {
      return this.enrollmentsService.findByStudent(studentId);
    }
    if (courseId) {
      return this.enrollmentsService.findByCourse(courseId);
    }
    return this.enrollmentsService.findAll(semester, section, search, isActive);
  }

  /**
   * Admin endpoint to create enrollment (assign student to course)
   * POST /api/enrollments/admin
   */
  @Post('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin assigns student to course' })
  @ApiResponse({ status: 201, description: 'Enrollment created successfully' })
  @ApiResponse({ status: 400, description: 'Already enrolled or bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  createByAdmin(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    if (!createEnrollmentDto.studentId) {
      throw new BadRequestException('Student ID is required when admin creates enrollment.');
    }
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get enrollment by ID' })
  @ApiResponse({ status: 200, description: 'Enrollment details' })
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove enrollment (Student or Admin)' })
  @ApiResponse({ status: 200, description: 'Enrollment removed' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    // Admin can remove any enrollment, students can only remove their own
    return this.enrollmentsService.remove(id, user);
  }
}

