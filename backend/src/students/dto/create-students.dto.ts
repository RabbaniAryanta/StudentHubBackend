import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  nis: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  majorId: number;

  @IsInt()
  @IsNotEmpty()
  batchId: number;
}