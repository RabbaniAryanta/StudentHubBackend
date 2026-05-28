import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';


@Injectable()
export class BankAccountsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBankAccountDto) {
    return this.prisma.bankAccount.create({ data });
  }

  async findAll() {
    return this.prisma.bankAccount.findMany();
  }

  async findOne(id: number) {
    const bankAccount = await this.prisma.bankAccount.findUnique({
      where: { id },
    });
    if (!bankAccount) {
      throw new NotFoundException(`BankAccount with ID ${id} not found`);
    }
    return bankAccount;
  }

  async update(id: number, data: UpdateBankAccountDto) {
    return this.prisma.bankAccount.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.bankAccount.delete({
      where: { id },
    });
  }
}
