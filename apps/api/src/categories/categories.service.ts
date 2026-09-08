import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toCategoryDto } from '../common/mappers';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const rows = await this.prisma.category.findMany({
      orderBy: [{ order: 'asc' }, { nameEn: 'asc' }],
      include: { _count: { select: { projects: true } } },
    });
    return rows.map(toCategoryDto);
  }

  async create(dto: CreateCategoryDto) {
    await this.assertSlugFree(dto.slug);
    const row = await this.prisma.category.create({
      data: {
        slug: dto.slug,
        nameKo: dto.nameKo,
        nameEn: dto.nameEn,
        order: dto.order ?? 0,
      },
      include: { _count: { select: { projects: true } } },
    });
    return toCategoryDto(row);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();
    if (dto.slug && dto.slug !== existing.slug) await this.assertSlugFree(dto.slug);
    const row = await this.prisma.category.update({
      where: { id },
      data: {
        slug: dto.slug,
        nameKo: dto.nameKo,
        nameEn: dto.nameEn,
        order: dto.order,
      },
      include: { _count: { select: { projects: true } } },
    });
    return toCategoryDto(row);
  }

  async remove(id: string) {
    const count = await this.prisma.project.count({ where: { categoryId: id } });
    if (count > 0) {
      throw new ConflictException(
        `이 카테고리를 쓰는 프로젝트가 ${count}개 있습니다. 먼저 옮겨 주세요.`,
      );
    }
    await this.prisma.category.delete({ where: { id } }).catch(() => {
      throw new NotFoundException();
    });
    return { ok: true };
  }

  private async assertSlugFree(slug: string) {
    const dup = await this.prisma.category.findUnique({ where: { slug } });
    if (dup) throw new ConflictException(`슬러그 "${slug}"가 이미 있습니다.`);
  }
}
