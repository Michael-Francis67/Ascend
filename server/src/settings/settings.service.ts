import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSettingDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.setting.upsert({
      where: { key: dto.key },
      update: {
        value: dto.value,
        type: dto.type || 'json',
        group: dto.group || 'general',
      },
      create: {
        key: dto.key,
        value: dto.value,
        type: dto.type || 'json',
        group: dto.group || 'general',
      },
    });
  }

  async findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.setting.findMany({
      orderBy: { group: 'asc' },
    });
  }

  async findByGroup(group: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.setting.findMany({
      where: { group },
      orderBy: { key: 'asc' },
    });
  }

  async findOne(key: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.setting.findUnique({
      where: { key },
    });
  }

  async update(key: string, dto: UpdateSettingDto) {
    await this.findOne(key);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.setting.update({
      where: { key },
      data: dto,
    });
  }

  async remove(key: string) {
    await this.findOne(key);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.setting.delete({
      where: { key },
    });
  }

  // Helper methods for common settings
  async getCompanyInfo() {
    try {
      const setting = await this.prisma.setting.findUnique({
        where: { key: 'company_info' },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return (
        setting?.value || {
          name: 'ASCEND',
          tagline: 'Building Businesses. Scaling Brands.',
          email: '',
          phone: '',
          address: 'Lagos, Nigeria',
        }
      );
    } catch {
      return {
        name: 'ASCEND',
        tagline: 'Building Businesses. Scaling Brands.',
        email: '',
        phone: '',
        address: 'Lagos, Nigeria',
      };
    }
  }

  async getSocialLinks() {
    try {
      const setting = await this.prisma.setting.findUnique({
        where: { key: 'social_links' },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return (
        setting?.value || {
          instagram: '',
          linkedin: '',
          youtube: '',
          whatsapp: '',
        }
      );
    } catch {
      return {
        instagram: '',
        linkedin: '',
        youtube: '',
        whatsapp: '',
      };
    }
  }

  async getBranding() {
    try {
      const setting = await this.prisma.setting.findUnique({
        where: { key: 'branding' },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return (
        setting?.value || {
          primaryColor: '#0F4C4C',
          secondaryColor: '#1A6B6B',
          logo: '',
          favicon: '',
        }
      );
    } catch {
      return {
        primaryColor: '#0F4C4C',
        secondaryColor: '#1A6B6B',
        logo: '',
        favicon: '',
      };
    }
  }

  async updateCompanyInfo(data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.create({
      key: 'company_info',
      value: data,
      type: 'json',
      group: 'company',
    });
  }

  async updateSocialLinks(data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.create({
      key: 'social_links',
      value: data,
      type: 'json',
      group: 'social',
    });
  }

  async updateBranding(data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.create({
      key: 'branding',
      value: data,
      type: 'json',
      group: 'branding',
    });
  }
}
