import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Wishlists')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post(':projectId')
  @ApiOperation({ summary: 'Menambahkan atau menghapus project dari wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist berhasil diubah.' })
  @ApiParam({ name: 'projectId', type: Number, example: 15 })
  toggle(@Request() req, @Param('projectId') projectId: string) {
    const userId = req.user.sub;
    return this.wishlistsService.toggleWishlist(userId, { projectId: +projectId } as any);
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil wishlist milik user login' })
  @ApiResponse({ status: 200, description: 'Wishlist berhasil diambil.' })
  findMyWishlist(@Request() req) {
    const userId = req.user.sub;
    return this.wishlistsService.findByUser(userId);
  }

  @Get('check/:projectId')
  @ApiOperation({ summary: 'Memeriksa status wishlist untuk project' })
  @ApiResponse({ status: 200, description: 'Status wishlist berhasil diambil.' })
  @ApiParam({ name: 'projectId', type: Number, example: 15 })
  checkStatus(@Request() req, @Param('projectId') projectId: string) {
    const userId = req.user.sub;
    return this.wishlistsService.checkStatus(userId, +projectId);
  }
}
