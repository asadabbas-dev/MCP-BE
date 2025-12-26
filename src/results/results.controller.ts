import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TeacherGuard } from '../common/guards/teacher.guard';
import { StudentGuard } from '../common/guards/student.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('results')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, TeacherGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enter grade (Teacher only)' })
  @ApiResponse({ status: 201, description: 'Grade created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher access required' })
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.resultsService.create(createGradeDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get student results (Student only)' })
  @ApiQuery({ name: 'semester', required: false })
  @ApiResponse({ status: 200, description: 'Student grades' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  getStudentResults(@CurrentUser() user: any, @Query('semester') semester?: string) {
    const studentId = user.studentId || user.student?.id;
    if (!studentId) {
      throw new Error('Student ID not found.');
    }
    if (semester) {
      return this.resultsService.findBySemester(studentId, semester);
    }
    return this.resultsService.findByStudent(studentId);
  }

  @Get('cgpa')
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Calculate student CGPA (Student only)' })
  @ApiResponse({ status: 200, description: 'CGPA calculated' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  getCGPA(@CurrentUser() user: any) {
    const studentId = user.studentId || user.student?.id;
    if (!studentId) {
      throw new Error('Student ID not found.');
    }
    return this.resultsService.calculateCGPA(studentId);
  }

  /**
   * Get grades for a course (Teacher only)
   * GET /api/results/course/:courseId
   */
  @Get('course/:courseId')
  @UseGuards(JwtAuthGuard, TeacherGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get grades for a course (Teacher only)', description: 'Retrieve all grades entered for a specific course' })
  @ApiResponse({ status: 200, description: 'List of grades for the course' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher access required' })
  getCourseGrades(@Param('courseId') courseId: string) {
    return this.resultsService.findByCourse(courseId);
  }
}

