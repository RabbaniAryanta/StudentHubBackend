import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../helper/cloudinary.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getBill(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return {
      orderId: order.id,
      orderCode: order.orderCode,
      totalPrice: order.totalPrice,
      status: order.status,
      items: order.items,
    };
  }

  async uploadPaymentProof(orderId: number, file: Express.Multer.File) {
    // Cek apakah order ada dan statusnya PENDING_PAYMENT
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (!['PENDING', 'PENDING_PAYMENT'].includes(order.status)) {
      throw new BadRequestException(
        'Order must be PENDING or PENDING_PAYMENT before uploading proof',
      );
    }

    // Upload file ke Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'payment-proofs',
    );

    // Simpan PaymentProof ke database
    const paymentProof = await this.prisma.paymentProof.create({
      data: {
        orderId,
        fileUrl: uploadResult.secure_url,
      },
    });

    // Update status order ke WAITING_VERIFICATION
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'WAITING_VERIFICATION' },
    });

    return {
      success: true,
      message: 'Payment proof uploaded successfully',
      data: paymentProof
    };
  }

  async getPaymentProof(orderId: number) {
    return await this.prisma.paymentProof.findMany({
      where: { orderId },
    });
  }

  async verifyPayment(paymentProofId: number, verifyDto: VerifyPaymentDto) {
    const paymentProof = await this.prisma.paymentProof.findUnique({
      where: { id: paymentProofId },
      include: { order: true },
    });

    if (!paymentProof) {
      throw new BadRequestException('Payment proof not found');
    }

    // Update status payment proof
    const updatedProof = await this.prisma.paymentProof.update({
      where: { id: paymentProofId },
      data: {
        status: verifyDto.status,
        adminNote: verifyDto.adminNote,
      },
    });

    // Jika payment approved, update order status menjadi PAID
    if (verifyDto.status === 'APPROVED') {
      await this.prisma.order.update({
        where: { id: paymentProof.orderId },
        data: { status: 'PAID' },
      });
    } else if (verifyDto.status === 'REJECTED') {
       await this.prisma.order.update({
        where: { id: paymentProof.orderId },
        data: { status: 'REJECTED' },
      });
    }

    return {
      success: true,
      message: `Payment status updated to ${verifyDto.status}`,
      data: updatedProof
    };
  }
}
