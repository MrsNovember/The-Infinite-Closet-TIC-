import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Entities
import { User } from './modules/users/entities/user.entity';
import { DigitalTwin } from './modules/digital-twin/entities/digital-twin.entity';
import { VirtualCloset } from './modules/virtual-closet/entities/virtual-closet.entity';
import { Outfit } from './modules/outfit/entities/outfit.entity';
import { RunwaySession } from './modules/runway/entities/runway-session.entity';
import { Product } from './modules/marketplace/entities/product.entity';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DigitalTwinModule } from './modules/digital-twin/digital-twin.module';
import { VirtualClosetModule } from './modules/virtual-closet/virtual-closet.module';
import { OutfitModule } from './modules/outfit/outfit.module';
import { RunwayModule } from './modules/runway/runway.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'tic_user',
      password: process.env.POSTGRES_PASSWORD || 'change_me',
      database: process.env.POSTGRES_DB || 'tic_main',
      entities: [User, DigitalTwin, VirtualCloset, Outfit, RunwaySession, Product],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.DB_LOGGING === 'true',
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: true,
    }),

    // JWT
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'change_me_to_secure_secret',
      signOptions: { expiresIn: '7d' },
    }),

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    // Feature Modules
    HealthModule,
    AuthModule,
    UsersModule,
    DigitalTwinModule,
    VirtualClosetModule,
    OutfitModule,
    RunwayModule,
    MarketplaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
