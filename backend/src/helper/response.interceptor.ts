import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    // Tentukan message default berdasarkan method HTTP kalau memungkinkan
    let message = 'Data berhasil diproses';
    if (context.switchToHttp().getRequest().method === 'GET') {
      message = 'Data berhasil diambil';
    } else if (context.switchToHttp().getRequest().method === 'POST') {
      message = 'Data berhasil ditambahkan';
    } else if (context.switchToHttp().getRequest().method === 'PATCH' || context.switchToHttp().getRequest().method === 'PUT') {
      message = 'Data berhasil diubah';
    } else if (context.switchToHttp().getRequest().method === 'DELETE') {
      message = 'Data berhasil dihapus';
    }

    return next.handle().pipe(
      map(data => {
        // Jika data sudah mempunyai format ini (contoh dari controller ngasih custom message), biarkan saja
        if (data && typeof data === 'object' && 'code' in data && 'status' in data && 'message' in data) {
          return data;
        }

        return {
          code: statusCode,
          status: 'success',
          message: data?.message || message, // jika data meng-override message
          data: data?.message && Object.keys(data).length === 1 ? null : (data?.data ?? data),
        };
      }),
    );
  }
}
