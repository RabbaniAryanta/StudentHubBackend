import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal Server Error';

        // 1. Tangani error standar HTTP (termasuk validasi class-validator dari DTO NestJS)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse: any = exception.getResponse();

            // Biasanya class-validator akan menaruh daftar error di properti 'message' berbentuk array
            message = exceptionResponse.message || exception.message;
        }
        // 2. Tangani error dari Prisma (diketahui dengan adanya properti 'code')
        else if (exception?.code) {
            switch (exception.code) {
                case 'P2002':
                    status = HttpStatus.CONFLICT;
                    // Kita juga bisa mengambil nama field yang bentrok di exception.meta.target
                    message = 'Terdapat duplikasi data. Data tersebut sudah terdaftar.';
                    break;
                case 'P2025':
                    status = HttpStatus.NOT_FOUND;
                    message = 'Data tidak ditemukan di database.';
                    break;
                default:
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Terjadi kesalahan pada database.';
                    console.error('[Prisma Error]:', exception);
                    break;
            }
        }
        // 3. Error tak terduga lainnya
        else {
            message = exception?.message || 'Terjadi kesalahan tidak terduga pada server.';
            console.error('[Unhandled Exception]:', exception); // Log di terminal server backend
        }

        // Kembalikan JSON yang sudah terstandardisasi sesuai permintaan
        response.status(status).json({
            code: status,
            status: 'error',
            message: Array.isArray(message) ? message[0] : message,
            data: null
        });
    }
}
