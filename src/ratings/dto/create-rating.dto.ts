import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    description: 'ID user pemberi rating',
    example: 3,
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @ApiProperty({
    description: 'ID project yang dinilai',
    example: 15,
  })
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @ApiProperty({
    description: 'Skor rating 1 sampai 5',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  score!: number;

  @ApiProperty({
    description: 'Komentar opsional dari user',
    example: 'Project sangat membantu untuk portofolio.',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}