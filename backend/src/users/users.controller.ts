import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get('me')
	@UseGuards(AuthGuard)
	getProfile(@Request() req: any) {
		return this.usersService.findOne(req.user.sub);
	}

	@Patch('me')
	@UseGuards(AuthGuard)
	updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(req.user.sub, updateUserDto);
	}

	@Get()
	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(+id);
	}

	@Patch(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	remove(@Param('id') id: string) {
		return this.usersService.remove(+id);
	}
}
