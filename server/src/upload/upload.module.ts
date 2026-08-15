import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary, configureCloudinary } from '../config/cloudinary';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        configureCloudinary(configService);

        const storage = new CloudinaryStorage({
          cloudinary: cloudinary,
          params: {
            folder: configService.get<string>(
              'CLOUDINARY_FOLDER',
              'ascend-website',
            ),
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' },
            ],
          } as any,
        });

        return {
          storage,
          limits: {
            fileSize: 50 * 1024 * 1024, // 50MB
          },
          fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
              return callback(
                new Error('Only image files are allowed!'),
                false,
              );
            }
            callback(null, true);
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
