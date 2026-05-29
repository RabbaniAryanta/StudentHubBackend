import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BatchesController],
  providers: [BatchesService]
})
export class BatchesModule {}
