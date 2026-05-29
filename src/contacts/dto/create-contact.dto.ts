import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString({ message: 'Nama harus berupa text' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @IsString({ message: 'Nomor HP harus berupa text' })
  @IsOptional()
  phone?: string;

  @IsString({ message: 'Pesan harus berupa text' })
  @IsNotEmpty({ message: 'Pesan tidak boleh kosong' })
  message: string;
}
