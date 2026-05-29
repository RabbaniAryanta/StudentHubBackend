import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../helper/roles-guard';
import { Roles } from '../helper/roles.decorator';
import { Role as RoleEnum } from '@prisma/client';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async createOrder(@Request() req, @Body() data: any) {
    return this.checkout(req, data);
  }

  @Post('checkout')
  async checkout(@Request() req, @Body() data: any) {
    try {
      const order = await this.ordersService.checkout(req.user.sub, data);
      return {
        success: true,
        message: 'Checkout successful',
        data: order,
      };
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.ordersService.findAll();
      return {
        success: true,
        message: 'Orders retrieved successfully',
        data,
      };
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.ordersService.findOne(Number(id));
      return {
        success: true,
        message: 'Order retrieved successfully',
        data,
      };
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ADMIN])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      const order = await this.ordersService.update(Number(id), data);
      return {
        success: true,
        message: 'Order updated successfully',
        data: order,
      };
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message || 'Internal server error',
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(RolesGuard)
  @Roles([RoleEnum.ADMIN])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const data = await this.ordersService.remove(Number(id));
      return {
        success: true,
        message: 'Order deleted successfully',
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
