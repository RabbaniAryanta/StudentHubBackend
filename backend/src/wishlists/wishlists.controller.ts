import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { WishlistsService } from './wishlists.service';
import { Prisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('wishlists')
export class WishlistsController {
	constructor(private readonly wishlistsService: WishlistsService) {}

	@Post()
	create(@Body() createWishlistDto: Prisma.WishlistUncheckedCreateInput) {
		return this.wishlistsService.create(createWishlistDto);
	}

	@Get()
	findAll() {
		return this.wishlistsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.wishlistsService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateWishlistDto: Prisma.WishlistUncheckedUpdateInput) {
		return this.wishlistsService.update(+id, updateWishlistDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.wishlistsService.remove(+id);
	}
}
