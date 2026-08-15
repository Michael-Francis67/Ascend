import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SectionsService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('sections')
@UseGuards(JwtAuthGuard)
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @Post()
  create(@Body() dto: CreateSectionDto) {
    return this.sectionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.sectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionsService.findOne(id);
  }

  @Get('key/:key')
  @Public()
  findByKey(@Param('key') key: string) {
    return this.sectionsService.findByKey(key);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
    return this.sectionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(id);
  }

  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string) {
    return this.sectionsService.toggleActive(id);
  }

  @Post('reorder')
  reorder(@Body('ids') ids: string[]) {
    return this.sectionsService.reorder(ids);
  }
}
