import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DigitalTwinService } from '../services/digital-twin.service';
import { CreateDigitalTwinDto, UpdateDigitalTwinDto } from '../dto/digital-twin.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('digital-twin')
@UseGuards(JwtAuthGuard)
export class DigitalTwinController {
  constructor(private readonly digitalTwinService: DigitalTwinService) {}

  @Post()
  async create(
    @Request() req: any,
    @Body() createDigitalTwinDto: CreateDigitalTwinDto,
  ) {
    return this.digitalTwinService.create(req.user.id, createDigitalTwinDto);
  }

  @Get('me')
  async getMyDigitalTwin(@Request() req: any) {
    return this.digitalTwinService.findByUserId(req.user.id);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.digitalTwinService.findById(id);
  }

  @Put(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDigitalTwinDto: UpdateDigitalTwinDto,
  ) {
    return this.digitalTwinService.update(id, req.user.id, updateDigitalTwinDto);
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    await this.digitalTwinService.delete(id, req.user.id);
    return { message: 'Digital twin deleted' };
  }

  @Put(':id/measurements')
  async updateMeasurements(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { measurements: Record<string, number> },
  ) {
    return this.digitalTwinService.updateMeasurements(
      id,
      req.user.id,
      body.measurements,
    );
  }

  @Post(':id/sync')
  async syncWithAvatar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { modelData: string },
  ) {
    return this.digitalTwinService.syncWithAvatar(id, req.user.id, body.modelData);
  }
}
