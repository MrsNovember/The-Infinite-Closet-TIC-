import { IsString, IsOptional, IsNumber, IsObject, IsInt } from 'class-validator';

export class CreateDigitalTwinDto {
  @IsOptional()
  @IsString()
  modelUrl?: string;

  @IsOptional()
  @IsObject()
  measurements?: Record<string, number>;

  @IsOptional()
  @IsString()
  skinTone?: string;

  @IsOptional()
  @IsNumber()
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsObject()
  facialFeatures?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsInt()
  renderQuality?: number;
}

export class UpdateDigitalTwinDto {
  @IsOptional()
  @IsString()
  modelUrl?: string;

  @IsOptional()
  @IsObject()
  measurements?: Record<string, number>;

  @IsOptional()
  @IsString()
  skinTone?: string;

  @IsOptional()
  @IsNumber()
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsObject()
  facialFeatures?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsInt()
  renderQuality?: number;

  @IsOptional()
  @IsString()
  poseState?: string;
}

export class DigitalTwinResponseDto {
  id: string;
  userId: string;
  modelUrl: string;
  measurements: Record<string, number>;
  skinTone: string;
  heightCm: number;
  weightKg: number;
  facialFeatures: Record<string, any>;
  metadata: Record<string, any>;
  renderQuality: number;
  poseState: string;
  modelQuality: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
