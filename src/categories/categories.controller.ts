import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const result = await this.categoriesService.create(createCategoryDto);
      return { success: true, data: result };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new HttpException({ success: false, message: 'Data tersebut sudah terdaftar.' }, HttpStatus.CONFLICT);
      }
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.categoriesService.findAll();
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.categoriesService.findOne(Number(id));
      if (!result) {
        throw new HttpException({ success: false, message: 'Data tidak ditemukan.' }, HttpStatus.NOT_FOUND);
      }
      return { success: true, data: result };
    } catch (error: any) {
      if (error.status === HttpStatus.NOT_FOUND) throw error;
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      const result = await this.categoriesService.update(Number(id), updateCategoryDto);
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

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.categoriesService.remove(Number(id));
      return { success: true, message: 'Data berhasil dihapus', data: result };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException({ success: false, message: 'Data tidak ditemukan.' }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
