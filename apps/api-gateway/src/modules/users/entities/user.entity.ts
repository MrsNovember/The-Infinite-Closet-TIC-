import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { DigitalTwin } from '../../digital-twin/entities/digital-twin.entity';
import { VirtualCloset } from '../../virtual-closet/entities/virtual-closet.entity';
import { Outfit } from '../../outfit/entities/outfit.entity';
import { RunwaySession } from '../../runway/entities/runway-session.entity';

@Entity('users')
@Index('idx_email', ['email'], { unique: true })
@Index('idx_username', ['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  verification_token: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };

  // Relations
  @OneToMany(() => DigitalTwin, (digitalTwin) => digitalTwin.user)
  digitalTwins: DigitalTwin[];

  @OneToMany(() => VirtualCloset, (closet) => closet.user)
  virtualClosets: VirtualCloset[];

  @OneToMany(() => Outfit, (outfit) => outfit.user)
  outfits: Outfit[];

  @OneToMany(() => RunwaySession, (session) => session.user)
  runwaySessions: RunwaySession[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
