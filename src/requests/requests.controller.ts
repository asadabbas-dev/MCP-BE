import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { RespondRequestDto } from './dto/respond-request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StudentGuard } from '../common/guards/student.guard';
import { RolesGuard, Roles } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create request (Student only)' })
  @ApiResponse({ status: 201, description: 'Request created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  create(@CurrentUser() user: any, @Body() createRequestDto: CreateRequestDto) {
    const studentId = user.studentId || user.student?.id;
    if (!studentId) {
      throw new Error('Student ID not found. Only students can create requests.');
    }
    return this.requestsService.create({ ...createRequestDto, studentId });
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student', 'teacher', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all requests (All authenticated users)' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'List of requests' })
  findAll(@Query('studentId') studentId?: string, @Query('status') status?: string) {
    if (studentId) {
      return this.requestsService.findByStudent(studentId);
    }
    if (status) {
      return this.requestsService.findByStatus(status);
    }
    return this.requestsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get request by ID' })
  @ApiResponse({ status: 200, description: 'Request details' })
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch(':id/respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Respond to request (Teacher or Admin only)' })
  @ApiResponse({ status: 200, description: 'Request responded' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher or Admin access required' })
  respond(@Param('id') id: string, @CurrentUser() user: any, @Body() respondDto: RespondRequestDto) {
    return this.requestsService.respond(id, user.id, respondDto);
  }
}

