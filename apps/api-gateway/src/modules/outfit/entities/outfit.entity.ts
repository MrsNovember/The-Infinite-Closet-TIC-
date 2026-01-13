import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('outfits', { schema: 'fashion' })
@Index(['userId'])
@Index(['isPublic'])
@Index(['occasion'])
export class Outfit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.outfits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  outfitName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  garments: Array<{
    garmentId: string;
    garmentName: string;
    category: string;
    imageUrl?: string;
  }>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  occasion: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  weatherSuitability: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  previewImageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ar3dModelUrl: string;

  @Column({ type: 'jsonb', default: () => "('{}')" })
  metadata: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'int', default: 0 })
  favoriteCount: number;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
