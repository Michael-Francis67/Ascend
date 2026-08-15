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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  @Public()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('active')
  @Public()
  getActive() {
    return this.servicesService.getActiveServices();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  toggleActive(@Param('id') id: string) {
    return this.servicesService.toggleActive(id);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  reorder(@Body('ids') ids: string[]) {
    return this.servicesService.reorder(ids);
  }
}
