import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  @IsNotEmpty({ message: 'Email harus diisi' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Kode OTP harus diisi' })
  @Length(6, 6, { message: 'Kode OTP harus 6 digit' })
  code: string;
}
