import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tags.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
