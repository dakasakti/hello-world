export interface JwtPayload {
  id: number;
  username: string;
  name: string;
  is_admin: boolean;
  iat?: number;
  exp?: number;
}
