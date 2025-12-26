import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumPost } from './entities/forum-post.entity';
import { ForumReply } from './entities/forum-reply.entity';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumPost)
    private postsRepository: Repository<ForumPost>,
    @InjectRepository(ForumReply)
    private repliesRepository: Repository<ForumReply>,
  ) {}

  async createPost(data: Partial<ForumPost>): Promise<ForumPost> {
    const post = this.postsRepository.create(data);
    return this.postsRepository.save(post);
  }

  async findAllPosts(): Promise<ForumPost[]> {
    return this.postsRepository.find({
      relations: ['author', 'course'],
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });
  }

  async findPostById(id: string): Promise<ForumPost> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'course', 'replies', 'replies.author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.viewCount += 1;
    await this.postsRepository.save(post);

    return post;
  }

  async createReply(postId: string, data: Partial<ForumReply>): Promise<ForumReply> {
    const reply = this.repliesRepository.create({ ...data, postId });
    return this.repliesRepository.save(reply);
  }
}

