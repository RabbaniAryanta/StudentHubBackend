import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) { }

  // Ambil cart user aktif, jika belum ada, buatkan otomatis
  async getCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            project: true,
          }
        },
      }
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { project: true } } }
      });
    }

    return cart;
  }

  async findAll() {
    return await this.prisma.cart.findMany({ include: { items: true } });
  }

  async findOne(id: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: Number(id) },
      include: { items: true },
    });
    if (!cart) throw new NotFoundException(`Cart with id ${id} not found`);
    return cart;
  }

  // Tambahkan item ke cart
  async addItem(userId: number, projectId: number, quantity: number = 1) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const cart = await this.getCart(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_projectId: { cartId: cart.id, projectId }
      }
    });

    if (existingItem) {
      return await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      return await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          projectId,
          quantity,
        },
      });
    }
  }

  // Hapus item dari cart
  async removeItem(userId: number, projectId: number) {
    const cart = await this.getCart(userId);
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_projectId: { cartId: cart.id, projectId }
      }
    });

    if (!existingItem) {
      throw new NotFoundException('Item not found in cart');
    }

    return await this.prisma.cartItem.delete({
      where: { id: existingItem.id }
    });
  }

  // Kosongkan cart (Hapus isi, biarkan cart induk)
  async clearCart(userId: number) {
    const cart = await this.getCart(userId);
    return await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
  }

  async remove(id: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: Number(id) },
      include: { items: true },
    });
    if (!cart) throw new NotFoundException(`Cart with id ${id} not found`);
    if (cart.items.length > 0) {
      throw new BadRequestException(`Cannot delete cart with id ${id} because it still has ${cart.items.length} item(s) inside`);
    }

    return await this.prisma.cart.delete({ where: { id: Number(id) } });
  }
}