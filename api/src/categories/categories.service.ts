import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(userId: string, data: { name: string }) {
    return this.prismaService.category.create({
      data: {
        name: data.name,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prismaService.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async update(userId: string, id: string, data: { name?: string }) {
    const result = await this.prismaService.category.updateMany({
      where: { id, userId },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return this.prismaService.category.findUnique({ where: { id } });
  }

  async remove(userId: string, id: string) {
    const category = await this.prismaService.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    await this.prismaService.$transaction([
      this.prismaService.transaction.deleteMany({
        where: { categoryId: id, userId },
      }),
      this.prismaService.category.delete({ where: { id } }),
    ]);

    return { id };
  }
}
