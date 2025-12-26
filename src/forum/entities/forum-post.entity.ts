import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { ForumReply } from './forum-reply.entity';

/**
 * Forum Post Entity
 * 
 * Represents a post in the community forum.
 * Can be linked to a specific course or be general.
 */
@Entity('forum_posts')
export class ForumPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  fileUrl: string; // Attached file URL

  @Column({ nullable: true })
  fileName: string; // Original file name

  @Column({ default: false })
  isPinned: boolean; // Pinned posts appear at top

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User)
  @JoinColumn()
  author: User;

  @Column()
  authorId: string; // Foreign key to users table

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn()
  course: Course;

  @Column({ nullable: true })
  courseId: string; // Foreign key to courses table (nullable for general posts)

  @OneToMany(() => ForumReply, (reply) => reply.post)
  replies: ForumReply[];
}

