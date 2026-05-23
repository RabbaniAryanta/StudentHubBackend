import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFiles, UseGuards, Request } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'mediaUrls', maxCount: 5 }
  ]))
  async create(
    @Request() req: any,
    @Body() createProjectDto: any,
    @UploadedFiles() files: { thumbnail?: Express.Multer.File[], mediaUrls?: Express.Multer.File[] }
  ) {
    return this.projectsService.create(createProjectDto, files, req.user);
  }

  @Get()
  async findAll() {
    return this.projectsService.findAllPublished();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }
}

