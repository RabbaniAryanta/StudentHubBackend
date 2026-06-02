import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    description: 'Nomor Induk Siswa (NIS)',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  nis!: string;

  @ApiProperty({
    description: 'Nama lengkap siswa',
    example: 'Ahmad Rabbani',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'ID jurusan siswa',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  majorId!: number;

  @ApiProperty({
    description: 'ID angkatan siswa',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  batchId!: number;
}