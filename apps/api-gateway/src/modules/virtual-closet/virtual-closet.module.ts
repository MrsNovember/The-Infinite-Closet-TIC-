import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualCloset } from './entities/virtual-closet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VirtualCloset])],
  providers: [],
  controllers: [],
  exports: [],
})
export class VirtualClosetModule {}
