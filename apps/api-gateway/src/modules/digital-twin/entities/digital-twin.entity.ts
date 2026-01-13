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

@Entity('digital_twins', { schema: 'fashion' })
@Index(['userId'])
@Index(['isActive'])
export class DigitalTwin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.digitalTwins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  modelUrl: string;

  @Column({ type: 'text', nullable: true })
  modelData: string;

  @Column({ type: 'jsonb', default: () => "('{}')" })
  measurements: Record<string, number>;

  @Column({ type: 'varchar', length: 50, nullable: true })
  skinTone: string;

  @Column({ type: 'int', nullable: true })
  heightCm: number;

  @Column({ type: 'float', nullable: true })
  weightKg: number;

  @Column({ type: 'jsonb', default: () => "('{}')" })
  facialFeatures: Record<string, any>;

  @Column({ type: 'jsonb', default: () => "('{}')" })
  metadata: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  renderQuality: number;

  @Column({ type: 'varchar', length: 50, default: 'idle' })
  poseState: string;

  @Column({ type: 'float', default: 0 })
  modelQuality: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
