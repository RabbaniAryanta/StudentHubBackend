import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID rekening bank tujuan pembayaran',
    example: 1,
  })
  @IsNumber()
  bankAccountId!: number;

  @ApiProperty({
    description: 'Catatan tambahan untuk order',
    example: 'Mohon diproses hari ini',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;
}