import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeamMemberDto) {
    return this.prisma.teamMember.create({
      data: {
        ...dto,
        specialties: dto.specialties || [],
      },
    });
  }

  async findAll() {
    return this.prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }

    return member;
  }

  async update(id: string, dto: UpdateTeamMemberDto) {
    await this.findOne(id);

    return this.prisma.teamMember.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.teamMember.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const member = await this.findOne(id);

    return this.prisma.teamMember.update({
      where: { id },
      data: {
        isActive: !member.isActive,
      },
    });
  }

  async reorder(ids: string[]) {
    const updates = ids.map((id, index) =>
      this.prisma.teamMember.update({
        where: { id },
        data: { order: index },
      }),
    );
    return Promise.all(updates);
  }

  async getActiveMembers() {
    return this.prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async getByRole(role: string) {
    return this.prisma.teamMember.findMany({
      where: { role },
      orderBy: { order: 'asc' },
    });
  }
}
