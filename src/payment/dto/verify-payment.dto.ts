import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Status verifikasi pembayaran',
    example: 'APPROVED',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
  })
  @IsNotEmpty()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status: any;

  @ApiPropertyOptional({
    description: 'Catatan admin untuk verifikasi',
    example: 'Bukti pembayaran valid',
  })
  @IsOptional()
  @IsString()
  adminNote?: string;
}
