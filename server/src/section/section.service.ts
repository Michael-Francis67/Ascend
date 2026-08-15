import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSectionDto) {
    return this.prisma.section.create({
      data: {
        ...dto,
        content: dto.content || {},
        images: dto.images || [],
      },
    });
  }

  async findByKey(key: string) {
    const section = await this.prisma.section.findUnique({
      where: { key },
    });

    if (!section) {
      throw new NotFoundException(`Section not found`);
    }

    return {
      ...section,
      content:
        typeof section.content === 'string'
          ? JSON.parse(section.content)
          : section.content,
    };
  }

  async findAll() {
    const sections = await this.prisma.section.findMany({
      orderBy: { order: 'asc' },
    });

    return sections.map((section) => ({
      ...section,
      content:
        typeof section.content === 'string'
          ? JSON.parse(section.content)
          : section.content,
    }));
  }

  async findOne(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Section not found`);
    }

    return {
      ...section,
      content:
        typeof section.content === 'string'
          ? JSON.parse(section.content)
          : section.content,
    };
  }

  async update(id: string, dto: UpdateSectionDto) {
    await this.findOne(id);

    const data: any = { ...dto };
    if (dto.content && typeof dto.content === 'object') {
      data.content = dto.content;
    }

    return this.prisma.section.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.section.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const section = await this.findOne(id);
    return this.prisma.section.update({
      where: { id },
      data: {
        isActive: !section.isActive,
      },
    });
  }

  async reorder(ids: string[]) {
    const updates = ids.map((id, index) =>
      this.prisma.section.update({
        where: { id },
        data: { order: index },
      }),
    );
    return Promise.all(updates);
  }

  async updateImage(id: string, imageUrl: string) {
    await this.findOne(id);
    return this.prisma.section.update({
      where: { id },
      data: { image: imageUrl },
    });
  }

  async updateGallery(id: string, images: string[]) {
    await this.findOne(id);
    return this.prisma.section.update({
      where: { id },
      data: { images },
    });
  }
}
