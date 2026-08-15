import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body('alt') alt?: string,
  ) {
    return this.uploadService.uploadFile(file, alt);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('alt') alt?: string,
  ) {
    return this.uploadService.uploadMultiple(files, alt);
  }

  @Get()
  async getAll() {
    return this.uploadService.getAllFiles();
  }

  @Delete(':publicId')
  async delete(@Param('publicId') publicId: string) {
    return this.uploadService.deleteFile(publicId);
  }

  @Get('optimize')
  getOptimizedUrl(
    @Query('url') url: string,
    @Query('width') width?: number,
    @Query('height') height?: number,
    @Query('quality') quality?: number,
  ) {
    const optimized = this.uploadService.getOptimizedUrl(
      decodeURIComponent(url),
      {
        width,
        height,
        quality,
      },
    );
    return { url: optimized };
  }
}
