import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StudentGuard } from '../common/guards/student.guard';
import { RolesGuard, Roles } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit feedback (Student only)' })
  @ApiResponse({ status: 201, description: 'Feedback submitted' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  create(@CurrentUser() user: any, @Body() createFeedbackDto: CreateFeedbackDto) {
    const studentId = user.studentId || user.student?.id;
    if (!studentId) {
      throw new Error('Student ID not found. Only students can submit feedback.');
    }
    return this.feedbackService.create({ ...createFeedbackDto, studentId });
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all feedback (Teacher or Admin only)' })
  @ApiQuery({ name: 'targetType', required: false })
  @ApiQuery({ name: 'targetId', required: false })
  @ApiResponse({ status: 200, description: 'List of feedback' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher or Admin access required' })
  findAll(@Query('targetType') targetType?: string, @Query('targetId') targetId?: string) {
    if (targetType) {
      return this.feedbackService.findByType(targetType);
    }
    if (targetId) {
      return this.feedbackService.findByTarget(targetId);
    }
    return this.feedbackService.findAll();
  }
}

