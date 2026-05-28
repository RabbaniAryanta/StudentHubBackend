import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { MajorsService } from './majors.service';
import { CreateMajorDto } from './dto/create-majors.dto';
import { UpdateMajorDto } from './dto/update-majors.dto';


@UseGuards(AuthGuard, RolesGuard)
@Role('ADMIN')
@Controller('majors')
export class MajorsController {
	constructor(private readonly majorsService: MajorsService) {}

	@Post()
	create(@Body() createMajorDto: CreateMajorDto) {
		return this.majorsService.create(createMajorDto);
	}

	@Get()
	findAll() {
		return this.majorsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.majorsService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateMajorDto: UpdateMajorDto) {
		return this.majorsService.update(+id, updateMajorDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.majorsService.remove(+id);
	}
}
