import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Judul project',
    example: 'Website E-Commerce Toko Buku',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Deskripsi lengkap project',
    example: 'Sebuah website e-commerce yang dibangun menggunakan Next.js dan NestJS untuk toko buku online.',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({
    description: 'Harga project (Decimal)',
    example: '150000',
    type: String,
  })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiPropertyOptional({
    description: 'Status project',
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    example: 'DRAFT',
  })
  @IsOptional()
  @IsString()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], { message: 'Status harus DRAFT, PUBLISHED, atau ARCHIVED' })
  status?: string;

  @ApiProperty({
    description: 'ID kategori project',
    example: '1',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  categoryId!: string;

  @ApiPropertyOptional({
    description: 'ID student atau array JSON student yang terlibat dalam project',
    example: '[1, 2]',
    type: String,
  })
  @IsOptional()
  @IsString()
  students?: string;

  @ApiPropertyOptional({
    description: 'Array JSON tag ID untuk project',
    example: '[1, 3]',
    type: String,
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({
    description: 'File gambar thumbnail project',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  thumbnail?: any;

  @ApiPropertyOptional({
    description: 'File gambar media project (maksimal 5 file)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  mediaUrls?: any[];
}
