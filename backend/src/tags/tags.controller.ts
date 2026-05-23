import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { TagsService } from './tags.service';
import { Prisma } from '@prisma/client';

@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Post()
	create(@Body() createTagDto: Prisma.TagCreateInput) {
		return this.tagsService.create(createTagDto);
	}

	@Get()
	findAll() {
		return this.tagsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.tagsService.findOne(+id);
	}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Patch(':id')
	update(@Param('id') id: string, @Body() updateTagDto: Prisma.TagUpdateInput) {
		return this.tagsService.update(+id, updateTagDto);
	}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id')
	remove(@Param('id') id: string) {
		return this.tagsService.remove(+id);
	}
}
