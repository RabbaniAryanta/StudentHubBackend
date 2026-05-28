import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batches.dto';
import { UpdateBatchDto } from './dto/update-batches.dto';


@UseGuards(AuthGuard, RolesGuard)
@Role('ADMIN')
@Controller('batches')
export class BatchesController {
	constructor(private readonly batchesService: BatchesService) {}

	@Post()
	create(@Body() createBatchDto: CreateBatchDto) {
		return this.batchesService.create(createBatchDto);
	}

	@Get()
	findAll() {
		return this.batchesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.batchesService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
		return this.batchesService.update(+id, updateBatchDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.batchesService.remove(+id);
	}
}
