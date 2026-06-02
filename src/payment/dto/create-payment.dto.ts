import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID order yang akan dibayar',
    example: 25,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  orderId!: number;
}
