import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
	@ApiProperty({
		description: 'Nama lengkap pengguna',
		example: 'Budi Santoso',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'Alamat email pengguna untuk registrasi',
		example: 'budi@gmail.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({
		description: 'Password akun yang akan dibuat',
		example: 'Password123',
		minLength: 6,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password!: string;

	@ApiProperty({
		description: 'Nomor telepon pengguna',
		example: '081234567890',
		required: false,
	})
	@IsString()
	@IsOptional()
	phone?: string;
}
