import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batches.dto';
import { UpdateBatchDto } from './dto/update-batches.dto';

@ApiTags('Batches')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Role('ADMIN')
@Controller('batches')
export class BatchesController {
	constructor(private readonly batchesService: BatchesService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat angkatan baru' })
  @ApiResponse({ status: 201, description: 'Angkatan berhasil dibuat.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 403, description: 'Forbidden — hanya ADMIN yang diizinkan.' })
  @ApiResponse({ status: 409, description: 'Angkatan sudah terdaftar.' })
  async create(@Body() createDto: CreateBatchDto) {
    try {
      const result = await this.batchesService.create(createDto);
      return { success: true, data: result };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new HttpException({ success: false, message: 'Data tersebut sudah terdaftar.' }, HttpStatus.CONFLICT);
      }
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil daftar semua angkatan' })
  @ApiResponse({ status: 200, description: 'Daftar angkatan berhasil diambil.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  async findAll() {
    try {
      const result = await this.batchesService.findAll();
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil detail angkatan berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Angkatan berhasil diambil.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 404, description: 'Angkatan tidak ditemukan.' })
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.batchesService.findOne(+id);
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
  @ApiOperation({ summary: 'Memperbarui angkatan berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Angkatan berhasil diperbarui.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 404, description: 'Angkatan tidak ditemukan.' })
  @ApiResponse({ status: 409, description: 'Angkatan sudah terdaftar.' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateBatchDto) {
    try {
      const result = await this.batchesService.update(+id, updateDto);
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
  @ApiOperation({ summary: 'Menghapus angkatan berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Angkatan berhasil dihapus.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — token tidak valid.' })
  @ApiResponse({ status: 404, description: 'Angkatan tidak ditemukan.' })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.batchesService.remove(+id);
      return { success: true, message: 'Data berhasil dihapus', data: result };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException({ success: false, message: 'Data tidak ditemukan.' }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
