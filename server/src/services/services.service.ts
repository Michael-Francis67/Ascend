import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);

    return this.prisma.service.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.service.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const service = await this.findOne(id);

    return this.prisma.service.update({
      where: { id },
      data: {
        isActive: !service.isActive,
      },
    });
  }

  async reorder(ids: string[]) {
    const updates = ids.map((id, index) =>
      this.prisma.service.update({
        where: { id },
        data: { order: index },
      }),
    );
    return Promise.all(updates);
  }

  async getActiveServices() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }
}
