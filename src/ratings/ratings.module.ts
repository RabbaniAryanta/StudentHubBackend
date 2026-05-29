import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [RatingsController],
  providers: [RatingsService]
})
export class RatingsModule {}
