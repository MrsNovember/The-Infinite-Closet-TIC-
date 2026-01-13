import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outfit } from './entities/outfit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Outfit])],
  providers: [],
  controllers: [],
  exports: [],
})
export class OutfitModule {}
