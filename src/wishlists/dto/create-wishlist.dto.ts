import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({
    description: 'ID user pemilik wishlist',
    example: 3,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID project yang ditambahkan ke wishlist',
    example: 15,
  })
  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}