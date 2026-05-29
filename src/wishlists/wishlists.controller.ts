import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post(':projectId')
  toggle(@Request() req, @Param('projectId') projectId: string) {
    const userId = req.user.sub;
    return this.wishlistsService.toggleWishlist(userId, { projectId: +projectId } as any);
  }

  @Get()
  findMyWishlist(@Request() req) {
    const userId = req.user.sub;
    return this.wishlistsService.findByUser(userId);
  }

  @Get('check/:projectId')
  checkStatus(@Request() req, @Param('projectId') projectId: string) {
    const userId = req.user.sub;
    return this.wishlistsService.checkStatus(userId, +projectId);
  }
}
