import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/pagination-query.dto';
import { toInquiryDto } from '../common/mappers';
import {
  CreateInquiryDto,
  InquiryQueryDto,
  UpdateInquiryDto,
} from './inquiries.dto';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInquiryDto) {
    // Honeypot: silently accept but drop obvious bots.
    if (dto.company && dto.company.trim().length > 0) {
      throw new BadRequestException('Rejected');
    }
    const { company: _hp, ...data } = dto;
    const row = await this.prisma.inquiry.create({ data });
    return toInquiryDto(row);
  }

  async findAll(q: InquiryQueryDto) {
    const where: Prisma.InquiryWhereInput = {
      ...(q.status ? { status: q.status } : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      this.prisma.inquiry.count({ where }),
    ]);
    return paginate(rows.map(toInquiryDto), total, q.page, q.pageSize);
  }

  async findOne(id: string) {
    const row = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    return toInquiryDto(row);
  }

  async update(id: string, dto: UpdateInquiryDto) {
    if (!(await this.prisma.inquiry.count({ where: { id } }))) {
      throw new NotFoundException();
    }
    return toInquiryDto(
      await this.prisma.inquiry.update({ where: { id }, data: dto }),
    );
  }

  async remove(id: string) {
    if (!(await this.prisma.inquiry.count({ where: { id } }))) {
      throw new NotFoundException();
    }
    await this.prisma.inquiry.delete({ where: { id } });
    return { ok: true };
  }

  async stats() {
    const grouped = await this.prisma.inquiry.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    const byStatus = Object.fromEntries(
      grouped.map((g) => [g.status, g._count._all]),
    );
    const total = grouped.reduce((sum, g) => sum + g._count._all, 0);
    return { total, byStatus };
  }
}
