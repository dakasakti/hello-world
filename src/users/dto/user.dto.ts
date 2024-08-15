import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  image: string;

  @Expose()
  bio: string;

  @Expose()
  is_admin: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
