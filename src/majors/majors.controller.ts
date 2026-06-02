import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { MajorsService } from './majors.service';
import { CreateMajorDto } from './dto/create-majors.dto';
import { UpdateMajorDto } from './dto/update-majors.dto';

@ApiTags('Majors')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Role('ADMIN')
@Controller('majors')
export class MajorsController {
	constructor(private readonly majorsService: MajorsService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat jurusan baru' })
  @ApiResponse({ status: 201, description: 'Jurusan berhasil dibuat.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 403, description: 'Forbidden — hanya ADMIN yang diizinkan.' })
  @ApiResponse({ status: 409, description: 'Jurusan sudah terdaftar.' })
  async create(@Body() createDto: CreateMajorDto) {
    try {
      const result = await this.majorsService.create(createDto);
      return { success: true, data: result };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new HttpException({ success: false, message: 'Data tersebut sudah terdaftar.' }, HttpStatus.CONFLICT);
      }
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil daftar semua jurusan' })
  @ApiResponse({ status: 200, description: 'Daftar jurusan berhasil diambil.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  async findAll() {
    try {
      const result = await this.majorsService.findAll();
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil detail jurusan berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Jurusan berhasil diambil.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 404, description: 'Jurusan tidak ditemukan.' })
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.majorsService.findOne(+id);
      if (!result) {
        throw new HttpException({ success: false, message: 'Data tidak ditemukan.' }, HttpStatus.NOT_FOUND);
      }
      return { success: true, data: result };
    } catch (error: any) {
      if (error.status === HttpStatus.NOT_FOUND) throw error;
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui jurusan berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Jurusan berhasil diperbarui.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 404, description: 'Jurusan tidak ditemukan.' })
  @ApiResponse({ status: 409, description: 'Jurusan sudah terdaftar.' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateMajorDto) {
    try {
      const result = await this.majorsService.update(+id, updateDto);
      return { success: true, data: result };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException({ success: false, message: 'Data tidak ditemukan untuk diupdate.' }, HttpStatus.NOT_FOUND);
      }
      if (error.code === 'P2002') {
        throw new HttpException({ success: false, message: 'Data tersebut sudah terdaftar.' }, HttpStatus.CONFLICT);
      }
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus jurusan berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Jurusan berhasil dihapus.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 404, description: 'Jurusan tidak ditemukan.' })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.majorsService.remove(+id);
      return { success: true, message: 'Data berhasil dihapus', data: result };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException({ success: false, message: 'Data tidak ditemukan.' }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
