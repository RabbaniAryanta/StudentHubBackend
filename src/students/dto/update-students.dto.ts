import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-students.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}