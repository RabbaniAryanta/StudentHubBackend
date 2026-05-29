import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  BadRequestException,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { UploadPaymentProofDto } from './dto/upload-payment-proof.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { Role as RoleEnum } from '@prisma/client';

import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('upload-proof/:orderId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPaymentProof(
    @Param('orderId', ParseIntPipe) orderId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const data = await this.paymentService.uploadPaymentProof(orderId, file);
    return { success: true, message: 'Payment proof uploaded', data };
  }

  @Get('proof/:orderId')
  @UseGuards(AuthGuard)
  async getPaymentProof(@Param('orderId', ParseIntPipe) orderId: number) {
    const data = await this.paymentService.getPaymentProof(orderId);
    return { success: true, message: 'Data berhasil diambil', data };
  }

  @Get('bill/:orderId')
  @UseGuards(AuthGuard)
  async getBill(@Param('orderId', ParseIntPipe) orderId: number) {
    const data = await this.paymentService.getBill(orderId);
    return { success: true, message: 'Data berhasil diambil', data };
  }

  @Patch('verify/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  async verifyPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyPaymentDto: VerifyPaymentDto,
  ) {
    const data = await this.paymentService.verifyPayment(id, verifyPaymentDto);
    return { success: true, message: 'Payment verified', data };
  }
}