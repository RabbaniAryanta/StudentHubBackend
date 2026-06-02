import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMajorDto {
  @ApiProperty({
    description: 'Nama jurusan',
    example: 'Rekayasa Perangkat Lunak',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}