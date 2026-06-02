import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nama kategori',
    example: 'Design',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Slug kategori',
    example: 'design',
  })
  @IsString()
  @IsNotEmpty()
  slug!: string;
}
