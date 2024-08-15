import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import jwtConfig from './config/jwt.config';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { RevokedTokensService } from 'src/revoked-tokens/revoked-tokens.service';

@Module({
  imports: [PassportModule, JwtModule.registerAsync(jwtConfig.asProvider())],
  controllers: [AuthController],
  providers: [
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    AuthService,
    UsersService,
    RevokedTokensService,
  ],
})
export class AuthModule {}
