import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete , HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-students.dto';
import { UpdateStudentDto } from './dto/update-students.dto';


@UseGuards(AuthGuard, RolesGuard)
@Role('ADMIN')
@Controller('students')
export class StudentsController {
	constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createDto: CreateStudentDto) {
    try {
      const result = await this.studentsService.create(createDto);
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
      const result = await this.studentsService.findAll();
      return { success: true, data: result };
    } catch (error: any) {
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.studentsService.findOne(+id);
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
  async update(@Param('id') id: string, @Body() updateDto: UpdateStudentDto) {
    try {
      const result = await this.studentsService.update(+id, updateDto);
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
  async remove(@Param('id') id: string) {
    try {
      const result = await this.studentsService.remove(+id);
      return { success: true, message: 'Data berhasil dihapus', data: result };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException({ success: false, message: 'Data tidak ditemukan.' }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({ success: false, message: error.message || 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
