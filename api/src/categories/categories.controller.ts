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
import { CategoriesService } from './categories.service';

@Controller('categories')
@UseGuards(ClerkAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Req() request: FastifyRequest & { user: { userId: string } },
    @Body() body: { name: string },
  ) {
    return this.categoriesService.create(request.user.userId, body);
  }

  @Get()
  findAll(@Req() request: FastifyRequest & { user: { userId: string } }) {
    return this.categoriesService.findAll(request.user.userId);
  }

  @Patch(':id')
  update(
    @Req() request: FastifyRequest & { user: { userId: string } },
    @Param('id') id: string,
    @Body() body: { name?: string },
  ) {
    return this.categoriesService.update(request.user.userId, id, body);
  }

  @Delete(':id')
  remove(
    @Req() request: FastifyRequest & { user: { userId: string } },
    @Param('id') id: string,
  ) {
    return this.categoriesService.remove(request.user.userId, id);
  }
}
