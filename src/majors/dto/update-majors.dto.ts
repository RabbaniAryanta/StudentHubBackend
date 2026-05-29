import { PartialType } from '@nestjs/mapped-types';
import { CreateMajorDto } from './create-majors.dto';

export class UpdateMajorDto extends PartialType(CreateMajorDto) {}