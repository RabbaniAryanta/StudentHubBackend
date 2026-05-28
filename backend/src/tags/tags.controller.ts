import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tags.dto';
import { UpdateTagDto } from './dto/update-tags.dto';


@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) { }

	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	@Post()
	create(@Body() createTagDto: CreateTagDto) {
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
	update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
		return this.tagsService.update(+id, updateTagDto);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.tagsService.remove(+id);
	}
}
