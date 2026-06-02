import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBankAccountDto {
    @ApiProperty({
        description: 'Nama bank',
        example: 'Bank BCA',
    })
    @IsString()
    @IsNotEmpty()
    bankName!: string;

    @ApiProperty({
        description: 'Nomor rekening',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    accountNumber!: string;

    @ApiProperty({
        description: 'Nama pemilik rekening',
        example: 'Budi Santoso',
    })
    @IsString()
    @IsNotEmpty()
    accountOwner!: string;
}
