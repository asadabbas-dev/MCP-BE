import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LostFoundService } from './lost-found.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('lost-found')
@Controller('lost-found')
export class LostFoundController {
  constructor(private readonly lostFoundService: LostFoundService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Report lost/found item' })
  @ApiResponse({ status: 201, description: 'Item reported' })
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.lostFoundService.create({ ...body, reportedById: user.id });
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiQuery({ name: 'type', required: false, enum: ['lost', 'found'] })
  @ApiResponse({ status: 200, description: 'List of items' })
  findAll(@Query('type') type?: string) {
    if (type) {
      return this.lostFoundService.findByType(type);
    }
    return this.lostFoundService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiResponse({ status: 200, description: 'Item details' })
  findOne(@Param('id') id: string) {
    return this.lostFoundService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update item status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.lostFoundService.updateStatus(id, body.status);
  }
}

