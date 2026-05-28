import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
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
	create(@Body() createStudentDto: CreateStudentDto) {
		return this.studentsService.create(createStudentDto);
	}

	@Get()
	findAll() {
		return this.studentsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.studentsService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
		return this.studentsService.update(+id, updateStudentDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.studentsService.remove(+id);
	}
}
