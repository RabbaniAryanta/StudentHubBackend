import { PartialType } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ContactStatus } from '@prisma/client';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsEnum(ContactStatus, { message: 'Status tidak valid (harus UNREAD, READ, atau REPLIED)' })
  @IsOptional()
  status?: ContactStatus;
}
