import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toServiceDto } from '../common/mappers';
import { CreateServiceDto, UpdateServiceDto } from './services.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic() {
    const rows = await this.prisma.service.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map(toServiceDto);
  }

  async findAllAdmin() {
    const rows = await this.prisma.service.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map(toServiceDto);
  }

  async create(dto: CreateServiceDto) {
    return toServiceDto(await this.prisma.service.create({ data: dto }));
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.ensureExists(id);
    return toServiceDto(
      await this.prisma.service.update({ where: { id }, data: dto }),
    );
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.service.delete({ where: { id } });
    return { ok: true };
  }

  private async ensureExists(id: string) {
    if (!(await this.prisma.service.count({ where: { id } }))) {
      throw new NotFoundException();
    }
  }
}
