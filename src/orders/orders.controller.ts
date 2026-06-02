import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../helper/roles-guard';
import { Roles } from '../helper/roles.decorator';
import { Role as RoleEnum } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ApiOperation({ summary: 'Membuat order dari cart aktif' })
  @ApiResponse({ status: 201, description: 'Order berhasil dibuat.' })
  @ApiResponse({ status: 400, description: 'Payload checkout tidak valid.' })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(@Request() req, @Body() data: CreateOrderDto) {
    return this.checkout(req, data);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout cart menjadi order' })
  @ApiResponse({ status: 201, description: 'Checkout berhasil.' })
  @ApiResponse({ status: 400, description: 'Cart kosong atau bank account belum diisi.' })
  @ApiBody({ type: CreateOrderDto })
  async checkout(@Request() req, @Body() data: CreateOrderDto) {
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
  @ApiOperation({ summary: 'Mengambil daftar order' })
  @ApiResponse({ status: 200, description: 'Daftar order berhasil diambil.' })
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
  @ApiOperation({ summary: 'Mengambil detail order berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Order berhasil diambil.' })
  @ApiResponse({ status: 404, description: 'Order tidak ditemukan.' })
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
  @ApiOperation({ summary: 'Memperbarui order berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Order berhasil diperbarui.' })
  @ApiResponse({ status: 404, description: 'Order tidak ditemukan.' })
  @ApiBody({ type: UpdateOrderDto })
  async update(@Param('id') id: string, @Body() data: UpdateOrderDto) {
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
  @ApiOperation({ summary: 'Menghapus order berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Order berhasil dihapus.' })
  @ApiResponse({ status: 404, description: 'Order tidak ditemukan.' })
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
