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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { UploadPaymentProofDto } from './dto/upload-payment-proof.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { Role as RoleEnum } from '@prisma/client';

import { VerifyPaymentDto } from './dto/verify-payment.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('upload-proof/:orderId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadPaymentProofDto })
  @ApiOperation({ summary: 'Mengunggah bukti pembayaran untuk order' })
  @ApiResponse({ status: 201, description: 'Bukti pembayaran berhasil diunggah.' })
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
  @ApiOperation({ summary: 'Mengambil bukti pembayaran berdasarkan order' })
  @ApiResponse({ status: 200, description: 'Bukti pembayaran berhasil diambil.' })
  async getPaymentProof(@Param('orderId', ParseIntPipe) orderId: number) {
    const data = await this.paymentService.getPaymentProof(orderId);
    return { success: true, message: 'Data berhasil diambil', data };
  }

  @Get('bill/:orderId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Mengambil detail tagihan order' })
  @ApiResponse({ status: 200, description: 'Tagihan berhasil diambil.' })
  async getBill(@Param('orderId', ParseIntPipe) orderId: number) {
    const data = await this.paymentService.getBill(orderId);
    return { success: true, message: 'Data berhasil diambil', data };
  }

  @Patch('verify/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @ApiOperation({ summary: 'Memverifikasi bukti pembayaran' })
  @ApiResponse({ status: 200, description: 'Pembayaran berhasil diverifikasi.' })
  @ApiBody({ type: VerifyPaymentDto })
  async verifyPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyPaymentDto: VerifyPaymentDto,
  ) {
    const data = await this.paymentService.verifyPayment(id, verifyPaymentDto);
    return { success: true, message: 'Payment verified', data };
  }
}