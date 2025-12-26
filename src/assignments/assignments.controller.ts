import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeAssignmentDto } from './dto/grade-assignment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TeacherGuard } from '../common/guards/teacher.guard';
import { StudentGuard } from '../common/guards/student.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, TeacherGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create assignment (Teacher only)' })
  @ApiResponse({ status: 201, description: 'Assignment created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher access required' })
  create(@CurrentUser() user: any, @Body() createAssignmentDto: CreateAssignmentDto) {
    const teacherId = user.teacherId || user.teacher?.id;
    if (!teacherId) {
      throw new Error('Teacher ID not found. Only teachers can create assignments.');
    }
    return this.assignmentsService.create({ ...createAssignmentDto, teacherId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiQuery({ name: 'courseId', required: false })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  findAll(@Query('courseId') courseId?: string, @Query('teacherId') teacherId?: string) {
    if (courseId) {
      return this.assignmentsService.findByCourse(courseId);
    }
    if (teacherId) {
      return this.assignmentsService.findByTeacher(teacherId);
    }
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment details' })
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit assignment (Student only)' })
  @ApiResponse({ status: 201, description: 'Assignment submitted' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  submit(@CurrentUser() user: any, @Body() submitDto: SubmitAssignmentDto) {
    const studentId = user.studentId || user.student?.id;
    if (!studentId) {
      throw new Error('Student ID not found. Only students can submit assignments.');
    }
    return this.assignmentsService.submitAssignment(studentId, submitDto);
  }

  @Get(':id/submissions')
  @UseGuards(JwtAuthGuard, TeacherGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all submissions for assignment (Teacher only)' })
  @ApiResponse({ status: 200, description: 'List of submissions' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher access required' })
  getSubmissions(@Param('id') id: string) {
    return this.assignmentsService.getSubmissions(id);
  }

  @Patch('submissions/:id/grade')
  @UseGuards(JwtAuthGuard, TeacherGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Grade submission (Teacher only)' })
  @ApiResponse({ status: 200, description: 'Submission graded' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher access required' })
  gradeSubmission(@Param('id') id: string, @Body() gradeDto: GradeAssignmentDto) {
    return this.assignmentsService.gradeSubmission(id, gradeDto);
  }
}

