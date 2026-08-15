import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    const newProject = await this.prisma.project.create({
      data: {
        ...dto,
        gallery: dto.gallery || [],
      },
    });

    console.log(JSON.stringify(newProject));

    return newProject;
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.project.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const project = await this.findOne(id);

    return this.prisma.project.update({
      where: { id },
      data: {
        isActive: !project.isActive,
      },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.project.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActiveProjects() {
    return this.prisma.project.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
