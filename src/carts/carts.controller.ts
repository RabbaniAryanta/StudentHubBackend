import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, HttpStatus, HttpException, ParseIntPipe } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  async createCart(@Request() req) {
    try {
      const data = await this.cartsService.getCart(req.user.sub);
      return {
        success: true,
        message: 'Cart created successfully',
        data,
      };
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getMyCart(@Request() req) {
    try {
      const data = await this.cartsService.getCart(req.user.sub);
      return {
        success: true,
        message: 'Cart retrieved successfully',
        data,
      };
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('items')
  async addItem(@Request() req, @Body() body: { projectId: number, quantity?: number }) {
    try {
      if (!body.projectId) {
        throw new HttpException('projectId is required', HttpStatus.BAD_REQUEST);
      }
      const data = await this.cartsService.addItem(req.user.sub, body.projectId, body.quantity || 1);
      return {
        success: true,
        message: 'Item added to cart successfully',
        data,
      };
    } catch (error: any) {
      if (error.code === 'P2025' || error.status === 404) {
        throw new HttpException({
          success: false,
          message: 'Project not found',
        }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({
        success: false,
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('items/:projectId')
  async removeItem(@Request() req, @Param('projectId', ParseIntPipe) projectId: number) {
    try {
      const data = await this.cartsService.removeItem(req.user.sub, projectId);
      return {
        success: true,
        message: 'Item removed from cart successfully',
        data,
      };
    } catch (error: any) {
      if (error.code === 'P2025' || error.status === 404) {
        throw new HttpException({
          success: false,
          message: 'Item not found in cart',
        }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({
        success: false,
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete()
  async clearCart(@Request() req) {
    try {
      const data = await this.cartsService.clearCart(req.user.sub);
      return {
        success: true,
        message: 'Cart cleared successfully',
        data,
      };
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 
