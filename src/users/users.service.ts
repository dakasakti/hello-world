import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as lodash from 'lodash';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async store({
    username,
    name,
    email,
    password,
  }: CreateUserDto): Promise<User> {
    const userName = username.toLowerCase();
    const formattedEmail = email.toLowerCase();

    const user = await this.findUserByUsernameOrEmail(userName, formattedEmail);
    if (user && user.username === userName) {
      throw new ConflictException('username already exists');
    }

    if (user && user.email === email) {
      throw new ConflictException('email already exists');
    }

    const data: User = {
      username: userName,
      name: lodash.startCase(name),
      email,
      password: bcrypt.hashSync(password, 10),
    };

    return this.prisma.user.create({ data });
  }

  async findUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async show(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, payload: UpdateUserDto): Promise<User> {
    if (payload.name) {
      payload.name = lodash.startCase(payload.name);
    }

    if (payload.password) {
      payload.password = bcrypt.hashSync(payload.password, 10);
    }

    const data = plainToClass(User, payload, {
      excludeExtraneousValues: true,
    });

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('At least one property must be provided');
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async index(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const query: any = {
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        username: true,
        name: true,
        image: true,
        bio: true,
        created_at: true,
        updated_at: true,
      },
      where: {
        is_admin: false,
      },
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

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({
        where: {
          ...query.where,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async updateAsAdmin(username: string) {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new ForbiddenException();
    }

    if (user.is_admin) {
      throw new NotFoundException();
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data: { is_admin: true },
    });
  }
}
