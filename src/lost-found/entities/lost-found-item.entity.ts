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

/**
 * Lost & Found Item Entity
 * 
 * Represents a lost or found item report.
 * Contains item details, location, and contact information.
 */
@Entity('lost_found_items')
export class LostFoundItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
  })
  type: string; // 'lost' or 'found'

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  photoUrl: string; // URL or path to item photo

  @Column()
  location: string; // Where item was found/lost

  @Column()
  contactInfo: string; // Contact information for recovery

  @Column({
    type: 'varchar',
    length: 20,
    default: 'open',
  })
  status: string; // 'open' or 'resolved'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User)
  @JoinColumn()
  reportedBy: User;

  @Column()
  reportedById: string; // Foreign key to users table
}

