import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BankAccountsService {
  constructor(private prisma: PrismaService) {}

  async create(createBankAccountDto: CreateBankAccountDto) {
    return await this.prisma.bankAccount.create({
      data: createBankAccountDto,
    });
  }

  async findAll() {
    return await this.prisma.bankAccount.findMany();
  }

  async findActive() {
    return await this.prisma.bankAccount.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: number) {
    const account = await this.prisma.bankAccount.findUnique({
      where: { id: Number(id) },
    });
    if (!account) throw new NotFoundException(`Bank Account #${id} not found`);
    return account;
  }

  async update(id: number, updateBankAccountDto: UpdateBankAccountDto) {
    await this.findOne(id);
    return await this.prisma.bankAccount.update({
      where: { id: Number(id) },
      data: updateBankAccountDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.bankAccount.delete({
      where: { id: Number(id) },
    });
  }
}
