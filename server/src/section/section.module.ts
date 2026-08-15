import { Module } from '@nestjs/common';
import { SectionsController } from './section.controller';
import { SectionsService } from './section.service';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService],
})
export class SectionsModule {}
