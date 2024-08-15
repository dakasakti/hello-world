import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';
import { JsonContentGuard } from 'src/common/guards/json-content.guard';
import { RevokedTokensService } from 'src/revoked-tokens/revoked-tokens.service';
import { JwtPayload } from './dto/payload.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from 'src/users/users.service';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('api/v1.0/auth')
export class AuthController {
  constructor(
    private readonly revokeService: RevokedTokensService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(JsonContentGuard, LocalGuard)
  async login(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: true,
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: req.user,
    });
  }

  @Post('logout')
  @UseGuards(JwtGuard, AuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    const { id, exp } = req.user as JwtPayload;

    const result = await this.revokeService.revokeToken(
      req.token,
      new Date(exp * 1000),
      id,
    );

    if (!result) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'INTERNAL_SERVER_ERROR',
        data: null,
      });
    }

    return res.status(HttpStatus.NO_CONTENT).json();
  }

  @Get('profile')
  @UseGuards(JwtGuard, AuthGuard)
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const { id } = req.user as JwtPayload;
    const result = await this.userService.show(id);
    if (!result) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'INTERNAL_SERVER_ERROR',
        data: null,
      });
    }

    return res.status(HttpStatus.OK).json({
      status: true,
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: plainToClass(UserDto, result),
    });
  }
}
