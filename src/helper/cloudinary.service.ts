import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';
import { Readable } from 'stream';
import 'multer'; // Mentrigger pemuatan tipe data Multer

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File, folder: string = 'katalog'): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
} 
