import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsNotEmpty()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status: any;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
