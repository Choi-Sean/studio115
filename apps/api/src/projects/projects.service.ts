import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/pagination-query.dto';
import { toProjectDto } from '../common/mappers';
import {
  CreateProjectDto,
  ProjectQueryDto,
  UpdateProjectDto,
} from './projects.dto';

const withImages = { images: true } satisfies Prisma.ProjectInclude;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublicList(q: ProjectQueryDto) {
    const where: Prisma.ProjectWhereInput = {
      published: true,
      ...(q.category ? { category: q.category } : {}),
      ...(q.featured ? { featured: true } : {}),
    };
    return this.page(where, q);
  }

  async findPublicBySlug(slug: string) {
    const row = await this.prisma.project.findFirst({
      where: { slug, published: true },
      include: withImages,
    });
    if (!row) throw new NotFoundException(`Project "${slug}" not found`);
    return toProjectDto(row);
  }

  async findAllAdmin(q: ProjectQueryDto) {
    const where: Prisma.ProjectWhereInput = {
      ...(q.category ? { category: q.category } : {}),
    };
    return this.page(where, q);
  }

  async findOneAdmin(id: string) {
    const row = await this.prisma.project.findUnique({
      where: { id },
      include: withImages,
    });
    if (!row) throw new NotFoundException();
    return toProjectDto(row);
  }

  async create(dto: CreateProjectDto) {
    const { images, ...rest } = dto;
    const row = await this.prisma.project.create({
      data: {
        ...rest,
        images: images?.length
          ? { create: images.map((i, idx) => this.imageData(i, idx)) }
          : undefined,
      },
      include: withImages,
    });
    return toProjectDto(row);
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.ensureExists(id);
    const { images, ...rest } = dto;
    const row = await this.prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(images
          ? {
              images: {
                deleteMany: {},
                create: images.map((i, idx) => this.imageData(i, idx)),
              },
            }
          : {}),
      },
      include: withImages,
    });
    return toProjectDto(row);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.project.delete({ where: { id } });
    return { ok: true };
  }

  private imageData(
    i: { url: string; alt?: string; order?: number },
    idx: number,
  ) {
    return { url: i.url, alt: i.alt ?? null, order: i.order ?? idx };
  }

  private async page(where: Prisma.ProjectWhereInput, q: ProjectQueryDto) {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        include: withImages,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      this.prisma.project.count({ where }),
    ]);
    return paginate(rows.map(toProjectDto), total, q.page, q.pageSize);
  }

  private async ensureExists(id: string) {
    if (!(await this.prisma.project.count({ where: { id } }))) {
      throw new NotFoundException();
    }
  }
}
