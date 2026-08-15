import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    super({
      adapter: new PrismaPg({
        connectionString: configService.get<string>('DATABASE_URL'),
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Clean database (for testing)
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    const models = [
      'verifications',
      'sections',
      'projects',
      'services',
      'testimonials',
      'team_members',
      'uploads',
    ];

    for (const model of models) {
      try {
        await this.$executeRawUnsafe(
          `TRUNCATE TABLE "${model}" RESTART IDENTITY CASCADE;`,
        );
      } catch (error) {
        console.warn(`Failed to truncate ${model}:`, error);
      }
    }
  }
}
