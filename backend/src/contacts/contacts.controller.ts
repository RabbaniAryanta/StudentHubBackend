import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';


@Controller('contacts')
export class ContactsController {
	constructor(private readonly contactsService: ContactsService) { }

	@Post()
	create(@Body() createContactDto: CreateContactDto) {
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
	update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
		return this.contactsService.update(+id, updateContactDto);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Role('ADMIN')
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.contactsService.remove(+id);
	}
}
