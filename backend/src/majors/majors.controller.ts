import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { MajorsService } from './majors.service';
import { Prisma } from '@prisma/client';

@UseGuards(AuthGuard, RolesGuard)
@Role('ADMIN')
@Controller('majors')
export class MajorsController {
	constructor(private readonly majorsService: MajorsService) {}

	@Post()
	create(@Body() createMajorDto: Prisma.MajorCreateInput) {
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
	update(@Param('id') id: string, @Body() updateMajorDto: Prisma.MajorUpdateInput) {
		return this.majorsService.update(+id, updateMajorDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.majorsService.remove(+id);
	}
}
