import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import type { Multer as File } from 'multer';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Multer {
      File: File;
    }
  }
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  constructor(private prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File, alt?: string) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const cloudinaryFile = file as any;

    this.logger.log(`Uploading file: ${JSON.stringify(cloudinaryFile)}`);

    // Store in CloudinaryUpload table
    const upload = await this.prisma.upload.create({
      data: {
        publicId: cloudinaryFile.filename || cloudinaryFile.public_id,
        url: cloudinaryFile.path,
        secureUrl: cloudinaryFile.path,
        format: cloudinaryFile.encoding || '',
        width: cloudinaryFile.width || 0,
        height: cloudinaryFile.height || 0,
        bytes: cloudinaryFile.size || 0,
        alt: alt || cloudinaryFile.originalname || '',
        uploadedBy: 'admin',
      },
    });

    return {
      id: upload.id,
      url: upload.url,
      secureUrl: upload.secureUrl,
      publicId: upload.publicId,
      alt: upload.alt,
    };
  }

  async uploadMultiple(files: Express.Multer.File[], alt?: string) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploads = [] as {
      id: string;
      url: string;
      secureUrl: string;
      publicId: string;
      alt: string | null;
    }[];
    for (const file of files) {
      const upload = await this.uploadFile(file, alt);
      uploads.push(upload);
    }

    return uploads;
  }

  async deleteFile(publicId: string) {
    const upload = await this.prisma.upload.findUnique({
      where: { publicId },
    });

    if (!upload) {
      throw new NotFoundException('File not found');
    }

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
          if (error) {
            reject(
              error instanceof Error
                ? error
                : new Error(
                    typeof error === 'string'
                      ? error
                      : 'Cloudinary delete failed',
                  ),
            );
          } else {
            resolve(result as UploadApiResponse);
          }
        });
      });

      if (result.result !== 'ok') {
        throw new Error('Failed to delete from Cloudinary');
      }

      await this.prisma.upload.delete({
        where: { publicId },
      });

      return { message: 'File deleted successfully' };
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw new BadRequestException('Failed to delete file');
    }
  }

  async getAllFiles() {
    return this.prisma.upload.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        publicId: true,
        url: true,
        secureUrl: true,
        format: true,
        width: true,
        height: true,
        bytes: true,
        alt: true,
        createdAt: true,
      },
    });
  }

  getOptimizedUrl(
    url: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    },
  ) {
    if (!url) return url;

    try {
      const publicId = this.extractPublicId(url);
      if (!publicId) return url;

      const transformations = [] as string[];

      if (options?.width || options?.height) {
        transformations.push(`w_${options?.width || 'auto'}`);
        transformations.push(`h_${options?.height || 'auto'}`);
        transformations.push('c_fill');
      }

      if (options?.quality) {
        transformations.push(`q_${options.quality}`);
      }

      if (transformations.length === 0) {
        transformations.push('q_auto:good');
        transformations.push('f_auto');
      }

      const transformString = transformations.join(',');
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

      return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
    } catch {
      return url;
    }
  }

  private extractPublicId(url: string): string | null {
    try {
      const matches = url.match(/\/upload\/(?:v\d+\/)?([^.]+)/);
      if (matches && matches[1]) {
        return matches[1];
      }
      return null;
    } catch {
      return null;
    }
  }
}
