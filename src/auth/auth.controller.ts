import { Controller, Post, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import FormatValidation from "../helper/validation-formats";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { RegisterAuthDto } from "./dto/register-auth.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
    async register(@Body() registerDto: RegisterAuthDto) {
        return this.authService.signUp(registerDto);
    }

    @Post('login')
    @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
    async login(@Body() authDto: CreateAuthDto) {
        return this.authService.signIn(authDto.email, authDto.password);
    }

    @Post('verify-otp')
    @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.code);
    }
}