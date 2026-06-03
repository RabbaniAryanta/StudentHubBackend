import { Controller, Post, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from "./auth.service";
import FormatValidation from "../helper/validation-formats";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { RegisterAuthDto } from "./dto/register-auth.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register akun baru user' })
    @ApiResponse({ status: 201, description: 'Akun berhasil didaftarkan.' })
    @ApiResponse({ status: 400, description: 'Data request tidak valid.' })
    @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
    async register(@Body() registerDto: RegisterAuthDto) {
        return this.authService.signUp(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user dan mendapatkan JWT' })
    @ApiResponse({ status: 200, description: 'Login berhasil.' })
    @ApiResponse({ status: 401, description: 'Email atau password salah.' })
    @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
    async login(@Body() authDto: CreateAuthDto) {
        return this.authService.signIn(authDto.email, authDto.password);
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verifikasi OTP untuk aktivasi akun' })
    @ApiResponse({ status: 200, description: 'OTP berhasil diverifikasi.' })
    @ApiResponse({ status: 400, description: 'OTP tidak valid.' })
    @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.code);
    }
}