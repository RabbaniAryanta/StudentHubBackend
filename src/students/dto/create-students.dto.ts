import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  nis: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  majorId: number;

  @IsInt()
  @IsNotEmpty()
  batchId: number;
}