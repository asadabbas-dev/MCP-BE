import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TeacherGuard } from '../common/guards/teacher.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { RolesGuard, Roles } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create notification (Teacher or Admin)' })
  @ApiResponse({ status: 201, description: 'Notification created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher or Admin access required' })
  create(@CurrentUser() user: any, @Body() createNotificationDto: CreateNotificationDto) {
    const teacherId = user.teacherId || user.teacher?.id;
    // Admin can create notifications without teacherId
    if (user.role === 'admin') {
      return this.notificationsService.create(createNotificationDto);
    }
    if (!teacherId) {
      throw new Error('Teacher ID not found. Only teachers can create notifications.');
    }
    return this.notificationsService.create({ ...createNotificationDto, teacherId });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get notifications' })
  @ApiQuery({ name: 'targetAudience', required: false })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiResponse({ status: 200, description: 'List of notifications' })
  findAll(
    @Query('targetAudience') targetAudience?: string,
    @Query('teacherId') teacherId?: string,
  ) {
    if (targetAudience) {
      return this.notificationsService.findByTarget(targetAudience);
    }
    if (teacherId) {
      return this.notificationsService.findByTeacher(teacherId);
    }
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ status: 200, description: 'Notification details' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}

