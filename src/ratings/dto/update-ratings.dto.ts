import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingDto } from './create-ratings.dto';

export class UpdateRatingDto extends PartialType(CreateRatingDto) {}
