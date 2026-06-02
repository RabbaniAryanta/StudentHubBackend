import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email yang menerima kode OTP',
    example: 'studenthub@example.com',
  })
  @IsEmail({}, { message: 'Email tidak valid' })
  @IsNotEmpty({ message: 'Email harus diisi' })
  email!: string;

  @ApiProperty({
    description: 'Kode OTP 6 digit yang dikirim ke email',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kode OTP harus diisi' })
  @Length(6, 6, { message: 'Kode OTP harus 6 digit' })
  code!: string;
}
