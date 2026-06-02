import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'Nama tag',
    example: 'Frontend',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
