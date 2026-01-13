import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigitalTwin } from './entities/digital-twin.entity';
import { CreateDigitalTwinDto, UpdateDigitalTwinDto } from './dto/digital-twin.dto';

@Injectable()
export class DigitalTwinService {
  constructor(
    @InjectRepository(DigitalTwin)
    private readonly digitalTwinRepository: Repository<DigitalTwin>,
  ) {}

  async create(
    userId: string,
    createDigitalTwinDto: CreateDigitalTwinDto,
  ): Promise<DigitalTwin> {
    // Check if user already has a digital twin
    const existing = await this.digitalTwinRepository.findOne({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException(
        'User already has a digital twin. Update existing one instead.',
      );
    }

    const digitalTwin = this.digitalTwinRepository.create({
      userId,
      ...createDigitalTwinDto,
      measurements: createDigitalTwinDto.measurements || {},
      facialFeatures: createDigitalTwinDto.facialFeatures || {},
      metadata: createDigitalTwinDto.metadata || {},
    });

    return this.digitalTwinRepository.save(digitalTwin);
  }

  async findByUserId(userId: string): Promise<DigitalTwin> {
    const digitalTwin = await this.digitalTwinRepository.findOne({
      where: { userId, isActive: true },
    });

    if (!digitalTwin) {
      throw new NotFoundException(
        `Digital twin not found for user ${userId}`,
      );
    }

    return digitalTwin;
  }

  async findById(id: string): Promise<DigitalTwin> {
    const digitalTwin = await this.digitalTwinRepository.findOne({
      where: { id, isActive: true },
    });

    if (!digitalTwin) {
      throw new NotFoundException(`Digital twin ${id} not found`);
    }

    return digitalTwin;
  }

  async update(
    id: string,
    userId: string,
    updateDigitalTwinDto: UpdateDigitalTwinDto,
  ): Promise<DigitalTwin> {
    const digitalTwin = await this.findById(id);

    if (digitalTwin.userId !== userId) {
      throw new BadRequestException(
        'You can only update your own digital twin',
      );
    }

    Object.assign(digitalTwin, updateDigitalTwinDto);
    return this.digitalTwinRepository.save(digitalTwin);
  }

  async delete(id: string, userId: string): Promise<void> {
    const digitalTwin = await this.findById(id);

    if (digitalTwin.userId !== userId) {
      throw new BadRequestException(
        'You can only delete your own digital twin',
      );
    }

    digitalTwin.isActive = false;
    await this.digitalTwinRepository.save(digitalTwin);
  }

  async updateMeasurements(
    id: string,
    userId: string,
    measurements: Record<string, number>,
  ): Promise<DigitalTwin> {
    const digitalTwin = await this.findById(id);

    if (digitalTwin.userId !== userId) {
      throw new BadRequestException(
        'You can only update your own measurements',
      );
    }

    digitalTwin.measurements = {
      ...digitalTwin.measurements,
      ...measurements,
    };

    return this.digitalTwinRepository.save(digitalTwin);
  }

  async syncWithAvatar(id: string, userId: string, modelData: string): Promise<DigitalTwin> {
    const digitalTwin = await this.findById(id);

    if (digitalTwin.userId !== userId) {
      throw new BadRequestException(
        'You can only sync your own digital twin',
      );
    }

    digitalTwin.modelData = modelData;
    digitalTwin.modelQuality = 1.0;

    return this.digitalTwinRepository.save(digitalTwin);
  }
}
