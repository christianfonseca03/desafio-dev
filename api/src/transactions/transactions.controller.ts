import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(ClerkAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Req() request: FastifyRequest & { user: { userId: string } },
    @Body()
    body: {
      categoryId: string;
      type: 'INCOME' | 'EXPENSE';
      amount: number;
      date: string;
      description?: string;
    },
  ) {
    return this.transactionsService.create(request.user.userId, body);
  }

  @Get()
  findAll(@Req() request: FastifyRequest & { user: { userId: string } }) {
    return this.transactionsService.findAll(request.user.userId);
  }

  @Patch(':id')
  update(
    @Req() request: FastifyRequest & { user: { userId: string } },
    @Param('id') id: string,
    @Body()
    body: {
      categoryId?: string;
      type?: 'INCOME' | 'EXPENSE';
      amount?: number;
      date?: string;
      description?: string;
    },
  ) {
    return this.transactionsService.update(request.user.userId, id, body);
  }

  @Delete(':id')
  remove(
    @Req() request: FastifyRequest & { user: { userId: string } },
    @Param('id') id: string,
  ) {
    return this.transactionsService.remove(request.user.userId, id);
  }
}
