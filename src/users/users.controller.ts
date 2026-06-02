import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ApiOperation({ summary: 'Membuat user baru' })
	@ApiResponse({ status: 201, description: 'User berhasil dibuat.' })
	@ApiResponse({ status: 400, description: 'Payload tidak valid.' })
	@ApiResponse({ status: 409, description: 'Email sudah digunakan.' })
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get('me')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Mengambil profil user yang sedang login' })
	@ApiResponse({ status: 200, description: 'Profil berhasil diambil.' })
	@UseGuards(AuthGuard)
	getProfile(@Request() req: any) {
		return this.usersService.findOne(req.user.sub);
	}

	@Patch('me')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Memperbarui profil user yang sedang login' })
	@ApiResponse({ status: 200, description: 'Profil berhasil diperbarui.' })
	@UseGuards(AuthGuard)
	updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(req.user.sub, updateUserDto);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Mengambil daftar semua user' })
	@ApiResponse({ status: 200, description: 'Daftar user berhasil diambil.' })
	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Mengambil detail user berdasarkan ID' })
	@ApiResponse({ status: 200, description: 'Detail user berhasil diambil.' })
	@ApiResponse({ status: 404, description: 'User tidak ditemukan.' })
	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(+id);
	}

	@Patch('toggle-2fa')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Mengaktifkan atau menonaktifkan 2FA' })
	@ApiResponse({ status: 200, description: 'Status 2FA berhasil diubah.' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				enable: { type: 'boolean', example: true },
				userId: { type: 'number', example: 12 },
			},
			required: ['enable'],
		},
	})
	@UseGuards(AuthGuard)
	toggleTwoFactor(
		@Body('enable') enable: boolean,
		@Body('userId') userId: number,
		@Request() req,
	) {
		let targetId = req.user.sub;

		if (userId && req.user.role === 'ADMIN') {
			targetId = Number(userId);
		} else if (userId && req.user.sub !== Number(userId)) {
			throw new ForbiddenException('Hanya ADMIN yang bisa mengubah setting user lain.');
		}

		return this.usersService.toggleTwoFactor(targetId, enable);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Mengubah data user berdasarkan ID' })
	@ApiResponse({ status: 200, description: 'User berhasil diperbarui.' })
	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Menghapus user berdasarkan ID' })
	@ApiResponse({ status: 200, description: 'User berhasil dihapus.' })
	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	remove(@Param('id') id: string) {
		return this.usersService.remove(+id);
	}
}
