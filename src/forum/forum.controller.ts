import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('forum')
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create forum post' })
  @ApiResponse({ status: 201, description: 'Post created' })
  createPost(@CurrentUser() user: any, @Body() body: any) {
    return this.forumService.createPost({ ...body, authorId: user.id });
  }

  @Get('posts')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'List of posts' })
  getPosts() {
    return this.forumService.findAllPosts();
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, description: 'Post details' })
  getPost(@Param('id') id: string) {
    return this.forumService.findPostById(id);
  }

  @Post('posts/:id/replies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reply to post' })
  @ApiResponse({ status: 201, description: 'Reply created' })
  createReply(@Param('id') postId: string, @CurrentUser() user: any, @Body() body: any) {
    return this.forumService.createReply(postId, { ...body, authorId: user.id });
  }
}

