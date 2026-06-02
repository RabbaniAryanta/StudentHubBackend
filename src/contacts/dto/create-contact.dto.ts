import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    description: 'Nama pengirim pesan',
    example: 'Budi Santoso',
  })
  @IsString({ message: 'Nama harus berupa text' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name!: string;

  @ApiProperty({
    description: 'Email pengirim pesan',
    example: 'budi@example.com',
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email!: string;

  @ApiPropertyOptional({
    description: 'Nomor telepon pengirim pesan',
    example: '081234567890',
  })
  @IsString({ message: 'Nomor HP harus berupa text' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Isi pesan kontak',
    example: 'Saya ingin menanyakan fitur project.' ,
  })
  @IsString({ message: 'Pesan harus berupa text' })
  @IsNotEmpty({ message: 'Pesan tidak boleh kosong' })
  message!: string;
}
