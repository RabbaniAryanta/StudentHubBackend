import { PartialType } from '@nestjs/swagger';
import { CreateMajorDto } from './create-majors.dto';

export class UpdateMajorDto extends PartialType(CreateMajorDto) {}