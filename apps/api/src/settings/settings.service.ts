import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingItemDto } from './settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMap(): Promise<Record<string, string>> {
    const rows = await this.prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async upsertMany(items: SettingItemDto[]): Promise<Record<string, string>> {
    await this.prisma.$transaction(
      items.map((i) =>
        this.prisma.siteSetting.upsert({
          where: { key: i.key },
          create: { key: i.key, value: i.value },
          update: { value: i.value },
        }),
      ),
    );
    return this.getMap();
  }
}
