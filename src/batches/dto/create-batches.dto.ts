import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBatchDto {
  @ApiProperty({
    description: 'Tahun angkatan',
    example: '2024',
  })
  @IsString()
  @IsNotEmpty()
  year!: string;
}