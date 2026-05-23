import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { RatingsService } from './ratings.service';
import { Prisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('ratings')
export class RatingsController {
	constructor(private readonly ratingsService: RatingsService) {}

	@Post()
	create(@Body() createRatingDto: Prisma.RatingUncheckedCreateInput) {
		return this.ratingsService.create(createRatingDto);
	}

	@Get()
	findAll() {
		return this.ratingsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.ratingsService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRatingDto: Prisma.RatingUncheckedUpdateInput) {
		return this.ratingsService.update(+id, updateRatingDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.ratingsService.remove(+id);
	}
}
