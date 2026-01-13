import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('products', { schema: 'marketplace' })
@Index(['brandId'])
@Index(['category'])
@Index(['isAvailable'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  brandId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  subcategory: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  material: string;

  @Column({ type: 'text', nullable: true })
  careInstructions: string;

  @Column({ type: 'jsonb' })
  images: Array<{
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  arModelUrl: string;

  @Column({ type: 'jsonb', default: () => "('{}')" })
  sizeChart: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  inventory: number;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: () => "('{}')" })
  metadata: Record<string, any>;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
