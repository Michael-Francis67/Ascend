import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { TestimonialsService } from './testimonials.service';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private testimonialsService: TestimonialsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Get()
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get('active')
  @Public()
  getActive() {
    return this.testimonialsService.getActiveTestimonials();
  }

  @Get('rating/:rating')
  @Public()
  getByRating(@Param('rating') rating: string) {
    return this.testimonialsService.getByRating(parseInt(rating));
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  toggleActive(@Param('id') id: string) {
    return this.testimonialsService.toggleActive(id);
  }
}
