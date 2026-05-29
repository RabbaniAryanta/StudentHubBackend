import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService, private readonly jwtService: JwtService) {}

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
    try {
      const result = await this.projectsService.create(createProjectDto, files, req.user);
      return { code: 201, status: 'success', message: 'Data berhasil ditambahkan', data: result };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.projectsService.findAllPublished();
      return { code: 200, status: 'success', message: 'Data berhasil diambil', data: result };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get('published')
  async findAllPublished() {
    try {
      const result = await this.projectsService.findAllPublished();
      return { code: 200, status: 'success', message: 'Data berhasil diambil', data: result };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':slugOrId')
  async findOne(@Request() req: any, @Param('slugOrId') slugOrId: string) {
    try {
      let result;
      if (!isNaN(Number(slugOrId))) {
         result = await this.projectsService.findOne(Number(slugOrId));
      } else {
         result = await this.projectsService.findBySlug(slugOrId);
      }
      
      // Check status
      if (result.status === 'DRAFT') {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new HttpException('Forbidden: Only ADMIN can view DRAFT projects', HttpStatus.FORBIDDEN);
        const token = authHeader.split(' ')[1];
        try {
          const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_VERIFY || 'secret-word' });
          if (payload.role !== 'ADMIN') {
            throw new Error('Not admin');
          }
        } catch {
          throw new HttpException('Forbidden: Only ADMIN can view DRAFT projects', HttpStatus.FORBIDDEN);
        }
      }
      
      return { code: 200, status: 'success', message: 'Data berhasil diambil', data: result };
    } catch (error: any) {
      if (error.status === HttpStatus.FORBIDDEN) throw error;
      throw new HttpException({ status: 'error', message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'mediaUrls', maxCount: 5 }
  ]))
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: any,
    @UploadedFiles() files: { thumbnail?: Express.Multer.File[], mediaUrls?: Express.Multer.File[] }
  ) {
    try {
      const result = await this.projectsService.update(Number(id), updateProjectDto, files);
      return { code: 200, status: 'success', message: 'Data berhasil diupdate', data: result };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.projectsService.remove(Number(id));
      return { code: 200, status: 'success', message: 'Data berhasil dihapus', data: result };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('all/admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  async findAllAdmin() {
    try {
      const result = await this.projectsService.findAll();
      return { code: 200, status: 'success', message: 'Data berhasil diambil', data: result };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
