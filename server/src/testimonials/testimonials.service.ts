import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: {
        ...dto,
        rating: dto.rating || 5,
      },
    });
  }

  async findAll() {
    return this.prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return testimonial;
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    await this.findOne(id);

    return this.prisma.testimonial.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.testimonial.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const testimonial = await this.findOne(id);

    return this.prisma.testimonial.update({
      where: { id },
      data: {
        isActive: !testimonial.isActive,
      },
    });
  }

  async getActiveTestimonials() {
    return this.prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByRating(rating: number) {
    return this.prisma.testimonial.findMany({
      where: { rating },
      orderBy: { createdAt: 'desc' },
    });
  }
}
