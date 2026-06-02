import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete , HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tags.dto';
import { UpdateTagDto } from './dto/update-tags.dto';


@ApiTags('Tags')
@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) { }

  @Post()
  @ApiOperation({ summary: 'Membuat tag baru' })
  @ApiResponse({ status: 201, description: 'Tag berhasil dibuat.' })
  @ApiResponse({ status: 409, description: 'Tag sudah terdaftar.' })
  async create(@Body() createDto: CreateTagDto) {
    try {
      const result = await this.tagsService.create(createDto);
      return { success: true, data: result };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new HttpException({ success: false, message: 'Data tersebut sudah terdaftar.' }, HttpStatus.CONFLICT);
      }
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil daftar tag' })
  @ApiResponse({ status: 200, description: 'Daftar tag berhasil diambil.' })
  async findAll() {
    try {
      const result = await this.tagsService.findAll();
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil detail tag berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Tag berhasil diambil.' })
  @ApiResponse({ status: 404, description: 'Tag tidak ditemukan.' })
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.tagsService.findOne(+id);
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
  @ApiOperation({ summary: 'Memperbarui tag berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Tag berhasil diperbarui.' })
  @ApiResponse({ status: 404, description: 'Tag tidak ditemukan.' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateTagDto) {
    try {
      const result = await this.tagsService.update(+id, updateDto);
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
  @ApiOperation({ summary: 'Menghapus tag berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Tag berhasil dihapus.' })
  @ApiResponse({ status: 404, description: 'Tag tidak ditemukan.' })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.tagsService.remove(+id);
      return { success: true, message: 'Data berhasil dihapus', data: result };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException({ success: false, message: 'Data tidak ditemukan.' }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
