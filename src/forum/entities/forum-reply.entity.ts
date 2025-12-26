import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ForumPost } from './forum-post.entity';

/**
 * Forum Reply Entity
 * 
 * Represents a reply to a forum post.
 * Links to the original post and the author.
 */
@Entity('forum_replies')
export class ForumReply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => ForumPost, (post) => post.replies)
  @JoinColumn()
  post: ForumPost;

  @Column()
  postId: string; // Foreign key to forum_posts table

  @ManyToOne(() => User)
  @JoinColumn()
  author: User;

  @Column()
  authorId: string; // Foreign key to users table
}

