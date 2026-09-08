import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/pagination-query.dto';
import { toProjectDto } from '../common/mappers';
import {
  CreateProjectDto,
  ProjectMediaInput,
  ProjectQueryDto,
  UpdateProjectDto,
} from './projects.dto';

const withRelations = {
  category: true,
  media: true,
} satisfies Prisma.ProjectInclude;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findPublicList(q: ProjectQueryDto) {
    const where: Prisma.ProjectWhereInput = {
      published: true,
      ...(q.category ? { category: { slug: q.category } } : {}),
      ...(q.featured ? { featured: true } : {}),
    };
    return this.page(where, q);
  }

  async findPublicBySlug(slug: string) {
    const row = await this.prisma.project.findFirst({
      where: { slug, published: true },
      include: withRelations,
    });
    if (!row) throw new NotFoundException(`Project "${slug}" not found`);
    return toProjectDto(row);
  }

  findAllAdmin(q: ProjectQueryDto) {
    const where: Prisma.ProjectWhereInput = {
      ...(q.category ? { category: { slug: q.category } } : {}),
    };
    return this.page(where, q);
  }

  async findOneAdmin(id: string) {
    const row = await this.prisma.project.findUnique({
      where: { id },
      include: withRelations,
    });
    if (!row) throw new NotFoundException();
    return toProjectDto(row);
  }

  async create(dto: CreateProjectDto) {
    const { media, categoryId, ...rest } = dto;
    await this.assertCategory(categoryId);
    const row = await this.prisma.project.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        media: media?.length
          ? { create: media.map((m, i) => this.mediaData(m, i)) }
          : undefined,
      },
      include: withRelations,
    });
    return toProjectDto(row);
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.ensureExists(id);
    const { media, categoryId, ...rest } = dto;
    if (categoryId) await this.assertCategory(categoryId);
    const row = await this.prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
        ...(media
          ? {
              media: {
                deleteMany: {},
                create: media.map((m, i) => this.mediaData(m, i)),
              },
            }
          : {}),
      },
      include: withRelations,
    });
    return toProjectDto(row);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.project.delete({ where: { id } });
    return { ok: true };
  }

  private mediaData(m: ProjectMediaInput, idx: number) {
    return {
      type: m.type ?? 'IMAGE',
      url: m.url,
      posterUrl: m.posterUrl ?? null,
      alt: m.alt ?? null,
      order: m.order ?? idx,
    };
  }

  private async page(where: Prisma.ProjectWhereInput, q: ProjectQueryDto) {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        include: withRelations,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      this.prisma.project.count({ where }),
    ]);
    return paginate(rows.map(toProjectDto), total, q.page, q.pageSize);
  }

  private async assertCategory(id: string) {
    if (!(await this.prisma.category.count({ where: { id } }))) {
      throw new BadRequestException(`카테고리를 찾을 수 없습니다: ${id}`);
    }
  }

  private async ensureExists(id: string) {
    if (!(await this.prisma.project.count({ where: { id } }))) {
      throw new NotFoundException();
    }
  }
}
