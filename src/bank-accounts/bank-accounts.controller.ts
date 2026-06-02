import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';


@ApiTags('Bank Accounts')
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Role('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Membuat rekening bank baru' })
  @ApiResponse({ status: 201, description: 'Rekening bank berhasil dibuat.' })
  create(@Body() createBankAccountDto: CreateBankAccountDto) {
    return this.bankAccountsService.create(createBankAccountDto);
  }

  @UseGuards(AuthGuard)
  @Get('active')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil daftar rekening bank aktif' })
  @ApiResponse({ status: 200, description: 'Rekening bank aktif berhasil diambil.' })
  findActive() {
    return this.bankAccountsService.findActive();
  }

  @Role('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil seluruh rekening bank' })
  @ApiResponse({ status: 200, description: 'Daftar rekening bank berhasil diambil.' })
  findAll() {
    return this.bankAccountsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil detail rekening bank berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Rekening bank berhasil diambil.' })
  findOne(@Param('id') id: string) {
    return this.bankAccountsService.findOne(+id);
  }

  @Role('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Memperbarui rekening bank berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Rekening bank berhasil diperbarui.' })
  update(@Param('id') id: string, @Body() updateBankAccountDto: UpdateBankAccountDto) {
    return this.bankAccountsService.update(+id, updateBankAccountDto);
  }

  @Role('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menghapus rekening bank berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Rekening bank berhasil dihapus.' })
  remove(@Param('id') id: string) {
    return this.bankAccountsService.remove(+id);
  }
}
