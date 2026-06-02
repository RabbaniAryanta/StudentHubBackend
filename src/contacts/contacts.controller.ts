import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import FormatValidation from '../helper/validation-formats';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';


@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
  @ApiOperation({ summary: 'Mengirim pesan kontak dari frontend' })
  @ApiResponse({ status: 201, description: 'Pesan kontak berhasil dikirim.' })
  @ApiBody({ type: CreateContactDto })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil daftar pesan kontak' })
  @ApiResponse({ status: 200, description: 'Daftar kontak berhasil diambil.' })
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil detail pesan kontak berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Pesan kontak berhasil diambil.' })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Memperbarui pesan kontak berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Pesan kontak berhasil diperbarui.' })
  @ApiBody({ type: UpdateContactDto })
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menghapus pesan kontak berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Pesan kontak berhasil dihapus.' })
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}
