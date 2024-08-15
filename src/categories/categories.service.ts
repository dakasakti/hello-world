import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as lodash from 'lodash';
import { PrismaService } from 'src/prisma.service';
import { Category } from './categories.model';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async index(search?: string) {
    const query: any = {
      orderBy: { created_at: 'desc' },
    };

    if (search) {
      query.where = {
        ...query.where,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    return this.prisma.category.findMany(query);
  }

  async findByName(name: string) {
    return this.prisma.category.findUnique({
      where: { name },
    });
  }

  async store(payload: CreateCategoryDto): Promise<Category> {
    payload.name = lodash.startCase(payload.name);
    const category = await this.findByName(payload.name);
    if (category) {
      throw new ConflictException('name already exists');
    }

    const data = plainToClass(Category, payload, {
      excludeExtraneousValues: true,
    });

    return this.prisma.category.create({ data });
  }

  async show(id: number): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async update(id: number, payload: UpdateCategoryDto): Promise<Category> {
    const category = await this.show(id);
    if (!category) {
      throw new NotFoundException();
    }

    if (payload.name) {
      payload.name = lodash.startCase(payload.name);

      const isUnique = await this.findByName(payload.name);
      if (isUnique && category.name != payload.name) {
        throw new ConflictException('name already exists');
      }
    }

    const data = plainToClass(Category, payload, {
      excludeExtraneousValues: true,
    });

    if (!data.name && !data.description) {
      throw new BadRequestException('At least one property must be provided');
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async destory(id: number): Promise<Category> {
    const category = await this.show(id);
    if (!category) {
      throw new NotFoundException();
    }

    return this.prisma.category.delete({ where: { id } });
  }
}
