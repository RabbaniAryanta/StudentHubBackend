import { Controller, UseGuards, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { BankAccountsService } from './bank-accounts.service';
import { Prisma } from '@prisma/client';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Post()
  create(@Body() createBankAccountDto: Prisma.BankAccountCreateInput) {
    return this.bankAccountsService.create(createBankAccountDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.bankAccountsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankAccountsService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankAccountDto: Prisma.BankAccountUpdateInput) {
    return this.bankAccountsService.update(+id, updateBankAccountDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankAccountsService.remove(+id);
  }
}
