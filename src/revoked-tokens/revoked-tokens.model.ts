import { Prisma } from '@prisma/client';

export class RevokedTokens implements Prisma.RevokedTokenCreateInput {
  id?: number;
  token: string;
  user_id: number;
  expires_at: string | Date;
  created_at?: Date;
  updated_at?: Date;
}
