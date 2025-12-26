import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('timetable')
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create timetable entry (Admin only)' })
  @ApiResponse({ status: 201, description: 'Timetable entry created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  create(@Body() createTimetableDto: CreateTimetableDto) {
    return this.timetableService.create(createTimetableDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get timetable' })
  @ApiQuery({ name: 'semester', required: false })
  @ApiQuery({ name: 'courseId', required: false })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiQuery({ name: 'search', required: false, description: 'Search by course name, code, room, or teacher name' })
  @ApiResponse({ status: 200, description: 'Timetable entries' })
  getTimetable(
    @Query('semester') semester?: string,
    @Query('courseId') courseId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('search') search?: string,
  ) {
    return this.timetableService.findBySemester(semester, search, courseId, teacherId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get timetable entry by ID' })
  @ApiParam({ name: 'id', description: 'Timetable entry ID' })
  @ApiResponse({ status: 200, description: 'Timetable entry details' })
  @ApiResponse({ status: 404, description: 'Timetable entry not found' })
  getTimetableById(@Param('id') id: string) {
    return this.timetableService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update timetable entry (Admin only)' })
  @ApiParam({ name: 'id', description: 'Timetable entry ID' })
  @ApiResponse({ status: 200, description: 'Timetable entry updated successfully' })
  @ApiResponse({ status: 404, description: 'Timetable entry not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  updateTimetable(
    @Param('id') id: string,
    @Body() updateTimetableDto: UpdateTimetableDto,
  ) {
    return this.timetableService.update(id, updateTimetableDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete timetable entry (Admin only)' })
  @ApiParam({ name: 'id', description: 'Timetable entry ID' })
  @ApiResponse({ status: 200, description: 'Timetable entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Timetable entry not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  deleteTimetable(@Param('id') id: string) {
    return this.timetableService.remove(id);
  }
}

