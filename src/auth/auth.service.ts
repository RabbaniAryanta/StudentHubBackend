import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async signUp(data: CreateUserDto) {
    const user = await this.userService.create(data);
    return {
      message: 'Registrasi berhasil. Silakan login.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
  }

  async signIn(email: string, pass: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Email atau password salah.');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Email atau password salah.');

    if (user.isTwoFactorEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      await this.prisma.otpCode.deleteMany({ where: { email } });

      await this.prisma.otpCode.create({
        data: {
          email,
          code: otp,
          expiresAt,
        },
      });

      await this.mailService.sendOtp(email, otp);

      return {
        message: 'Kode OTP telah dikirim ke email Anda.',
        requires2FA: true,
      };
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('User tidak ditemukan.');

    const otpRecord = await this.prisma.otpCode.findFirst({
      where: { email },
    });

    if (!otpRecord) {
      throw new BadRequestException('Kode OTP tidak ditemukan atau sudah kedaluwarsa.');
    }

    if (otpRecord.attempts >= 3) {
      await this.prisma.otpCode.delete({ where: { id: otpRecord.id } });
      throw new BadRequestException('Batas percobaan terlampaui. Silakan login kembali.');
    }

    if (new Date() > otpRecord.expiresAt) {
      await this.prisma.otpCode.delete({ where: { id: otpRecord.id } });
      throw new BadRequestException('Kode OTP sudah kedaluwarsa.');
    }

    if (otpRecord.code !== code) {
      await this.prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException(`Kode OTP salah. Sisa percobaan: ${2 - otpRecord.attempts}`);
    }

    await this.prisma.otpCode.delete({ where: { id: otpRecord.id } });

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}