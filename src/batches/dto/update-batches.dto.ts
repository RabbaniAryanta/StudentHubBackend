import { PartialType } from '@nestjs/swagger';
import { CreateBatchDto } from './create-batches.dto';

export class UpdateBatchDto extends PartialType(CreateBatchDto) {}