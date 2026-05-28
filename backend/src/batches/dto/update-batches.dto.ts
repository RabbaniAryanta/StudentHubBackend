import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchDto } from './create-batches.dto';

export class UpdateBatchDto extends PartialType(CreateBatchDto) {}