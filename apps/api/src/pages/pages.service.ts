import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toPageDto } from '../common/mappers';
import { UpsertPageDto } from './pages.dto';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const rows = await this.prisma.page.findMany({ orderBy: { slug: 'asc' } });
    return rows.map(toPageDto);
  }

  async getBySlug(slug: string) {
    const row = await this.prisma.page.findUnique({ where: { slug } });
    if (!row) throw new NotFoundException(`Page "${slug}" not found`);
    return toPageDto(row);
  }

  async upsert(slug: string, dto: UpsertPageDto) {
    const row = await this.prisma.page.upsert({
      where: { slug },
      create: { slug, ...dto },
      update: dto,
    });
    return toPageDto(row);
  }
}
