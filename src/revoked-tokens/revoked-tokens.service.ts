import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RevokedTokens } from 'src/revoked-tokens/revoked-tokens.model';

@Injectable()
export class RevokedTokensService {
  constructor(private prisma: PrismaService) {}

  async revokeToken(token: string, expires_at: Date, user_id: number) {
    const data: RevokedTokens = {
      token,
      expires_at,
      user_id,
    };

    return this.prisma.revokedToken.create({ data });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const match = await this.prisma.revokedToken.findUnique({
      where: { token },
    });

    return !!match;
  }
}
