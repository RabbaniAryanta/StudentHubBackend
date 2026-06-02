import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
	@ApiProperty({
		description: 'Alamat email pengguna untuk login',
		example: 'studenthub@example.com',
	})
	@IsEmail()
	email!: string;

	@ApiProperty({
		description: 'Password akun pengguna',
		example: 'Password123',
		minLength: 6,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password!: string;
}
