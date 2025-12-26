import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StudentGuard } from '../common/guards/student.guard';
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
      throw new Error('Student ID not found. Only students can enroll in courses.');
    }
    return this.enrollmentsService.create({ ...createEnrollmentDto, studentId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all enrollments' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'courseId', required: false })
  @ApiResponse({ status: 200, description: 'List of enrollments' })
  findAll(@Query('studentId') studentId?: string, @Query('courseId') courseId?: string) {
    if (studentId) {
      return this.enrollmentsService.findByStudent(studentId);
    }
    if (courseId) {
      return this.enrollmentsService.findByCourse(courseId);
    }
    return this.enrollmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get enrollment by ID' })
  @ApiResponse({ status: 200, description: 'Enrollment details' })
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove enrollment (Student only)' })
  @ApiResponse({ status: 200, description: 'Enrollment removed' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(id);
  }
}

