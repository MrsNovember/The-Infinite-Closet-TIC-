import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigitalTwin } from './entities/digital-twin.entity';
import { DigitalTwinService } from './services/digital-twin.service';
import { DigitalTwinController } from './controllers/digital-twin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DigitalTwin])],
  providers: [DigitalTwinService],
  controllers: [DigitalTwinController],
  exports: [DigitalTwinService],
})
export class DigitalTwinModule {}
