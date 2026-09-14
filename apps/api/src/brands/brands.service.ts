import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toBrandDto } from '../common/mappers';
import { CreateBrandDto, UpdateBrandDto } from './brands.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic() {
    const rows = await this.prisma.brand.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map(toBrandDto);
  }

  async listAll() {
    const rows = await this.prisma.brand.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map(toBrandDto);
  }

  async create(dto: CreateBrandDto) {
    await this.assertSlugFree(dto.slug);
    const row = await this.prisma.brand.create({
      data: {
        slug: dto.slug,
        tagKo: dto.tagKo,
        tagEn: dto.tagEn,
        nameKo: dto.nameKo,
        nameEn: dto.nameEn,
        descriptionKo: dto.descriptionKo,
        descriptionEn: dto.descriptionEn,
        live: dto.live ?? false,
        published: dto.published ?? true,
        order: dto.order ?? 0,
      },
    });
    return toBrandDto(row);
  }

  async update(id: string, dto: UpdateBrandDto) {
    const existing = await this.prisma.brand.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();
    if (dto.slug && dto.slug !== existing.slug) await this.assertSlugFree(dto.slug);
    const row = await this.prisma.brand.update({ where: { id }, data: dto });
    return toBrandDto(row);
  }

  async remove(id: string) {
    await this.prisma.brand.delete({ where: { id } }).catch(() => {
      throw new NotFoundException();
    });
    return { ok: true };
  }

  private async assertSlugFree(slug: string) {
    const dup = await this.prisma.brand.findUnique({ where: { slug } });
    if (dup) throw new ConflictException(`슬러그 "${slug}"가 이미 있습니다.`);
  }
}
