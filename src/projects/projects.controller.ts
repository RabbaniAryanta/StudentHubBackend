import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService, private readonly jwtService: JwtService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Membuat project baru (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Project berhasil dibuat.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 403, description: 'Forbidden — hanya ADMIN yang diizinkan.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'mediaUrls', maxCount: 5 }
  ]))
  async create(
    @Request() req: any,
    @Body() createProjectDto: CreateProjectDto,
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
  @ApiOperation({ summary: 'Mengambil semua project yang dipublikasikan' })
  @ApiResponse({ status: 200, description: 'Daftar project berhasil diambil.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll() {
    try {
      const result = await this.projectsService.findAllPublished();
      return { code: 200, status: 'success', message: 'Data berhasil diambil', data: result };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get('published')
  @ApiOperation({ summary: 'Mengambil semua project yang berstatus PUBLISHED' })
  @ApiResponse({ status: 200, description: 'Daftar project published berhasil diambil.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllPublished() {
    try {
      const result = await this.projectsService.findAllPublished();
      return { code: 200, status: 'success', message: 'Data berhasil diambil', data: result };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':slugOrId')
  @ApiOperation({ summary: 'Mengambil detail project berdasarkan slug atau ID' })
  @ApiResponse({ status: 200, description: 'Detail project berhasil diambil.' })
  @ApiResponse({ status: 403, description: 'Forbidden — project DRAFT hanya bisa dilihat ADMIN.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Memperbarui project berdasarkan ID (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Project berhasil diperbarui.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 403, description: 'Forbidden — hanya ADMIN yang diizinkan.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'mediaUrls', maxCount: 5 }
  ]))
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menghapus project berdasarkan ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Project berhasil dihapus.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 403, description: 'Forbidden — hanya ADMIN yang diizinkan.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil semua project termasuk DRAFT (Admin only)' })
  @ApiResponse({ status: 200, description: 'Daftar semua project berhasil diambil.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 403, description: 'Forbidden — hanya ADMIN yang diizinkan.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllAdmin() {
    try {
      const result = await this.projectsService.findAll();
      return { code: 200, status: 'success', message: 'Data berhasil diambil', data: result };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
