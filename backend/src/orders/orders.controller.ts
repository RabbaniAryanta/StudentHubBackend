import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';


@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@UseGuards(AuthGuard)
  @Post()
	create(@Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.create(createOrderDto);
	}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Get()
	findAll() {
		return this.ordersService.findAll();
	}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Get(':id')
	findOne(@Param('id') id: string) {
		return this.ordersService.findOne(+id);
	}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Patch(':id')
	update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
		return this.ordersService.update(+id, updateOrderDto);
	}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id')
	remove(@Param('id') id: string) {
		return this.ordersService.remove(+id);
	}
}
