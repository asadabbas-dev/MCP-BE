import { Controller, Get, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StudentGuard } from '../common/guards/student.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('fees')
@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get student fees (Student only)' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'paid'] })
  @ApiResponse({ status: 200, description: 'List of fees' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  getStudentFees(@CurrentUser() user: any, @Query('status') status?: string) {
    const studentId = user.studentId || user.student?.id;
    if (!studentId) {
      throw new Error('Student ID not found.');
    }
    if (status === 'pending') {
      return this.feesService.findPending(studentId);
    }
    if (status === 'paid') {
      return this.feesService.findPaid(studentId);
    }
    return this.feesService.findByStudent(studentId);
  }

  @Patch(':id/pay')
  @UseGuards(JwtAuthGuard, StudentGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Pay fee (Student only)' })
  @ApiResponse({ status: 200, description: 'Fee paid successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student access required' })
  payFee(
    @Param('id') id: string,
    @Body() body: { paymentMethod: string; transactionId: string },
  ) {
    return this.feesService.payFee(id, body.paymentMethod, body.transactionId);
  }
}

