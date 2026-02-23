import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    userId: string,
    data: {
      categoryId: string;
      type: 'INCOME' | 'EXPENSE';
      amount: number;
      date: string;
      description?: string;
    },
  ) {
    const category = await this.prismaService.category.findFirst({
      where: { id: data.categoryId, userId },
    });

    if (!category) {
      throw new BadRequestException('Categoria inválida');
    }
    return this.prismaService.transaction.create({
      data: {
        userId,
        categoryId: data.categoryId,
        type: data.type,
        amount: data.amount,
        date: new Date(data.date),
        description: data.description,
      },
    });
  }

  findAll(userId: string) {
    return this.prismaService.transaction.findMany({
      where: {
        userId,
      },
      orderBy: { date: 'desc' },
    });
  }

  async update(
    userId: string,
    id: string,
    data: {
      categoryId?: string;
      type?: 'INCOME' | 'EXPENSE';
      amount?: number;
      date?: string;
      description?: string;
    },
  ) {
    const transaction = await this.prismaService.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    if (data.categoryId) {
      const category = await this.prismaService.category.findFirst({
        where: { id: data.categoryId, userId },
      });

      if (!category) {
        throw new BadRequestException('Categoria inválida');
      }
    }
    return this.prismaService.transaction.update({
      where: { id },
      data: {
        categoryId: data.categoryId ?? undefined,
        type: data.type ?? undefined,
        amount: data.amount ?? undefined,
        date: data.date ? new Date(data.date) : undefined,
        description: data.description ?? undefined,
      },
    });
  }

  async remove(userId: string, id: string) {
    const transaction = await this.prismaService.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    await this.prismaService.transaction.delete({ where: { id } });
    return { id };
  }
}
