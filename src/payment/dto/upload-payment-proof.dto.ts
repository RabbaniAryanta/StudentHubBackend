import { ApiProperty } from '@nestjs/swagger';

export class UploadPaymentProofDto {
  @ApiProperty({
    description: 'File bukti pembayaran',
    type: 'string',
    format: 'binary',
  })
  file!: any;
}
