import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunwaySession } from './entities/runway-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RunwaySession])],
  providers: [],
  controllers: [],
  exports: [],
})
export class RunwayModule {}
