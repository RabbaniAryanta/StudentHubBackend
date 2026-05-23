import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../helper/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}