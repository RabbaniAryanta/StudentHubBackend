import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { ContactsService } from './contacts.service';
import { Prisma } from '@prisma/client';

@Controller('contacts')
export class ContactsController {
	constructor(private readonly contactsService: ContactsService) {}

	@Post()
	create(@Body() createContactDto: Prisma.ContactCreateInput) {
		return this.contactsService.create(createContactDto);
	}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Get()
	findAll() {
		return this.contactsService.findAll();
	}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Get(':id')
	findOne(@Param('id') id: string) {
		return this.contactsService.findOne(+id);
	}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Patch(':id')
	update(@Param('id') id: string, @Body() updateContactDto: Prisma.ContactUpdateInput) {
		return this.contactsService.update(+id, updateContactDto);
	}

	@UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id')
	remove(@Param('id') id: string) {
		return this.contactsService.remove(+id);
	}
}
