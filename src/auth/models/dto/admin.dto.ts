import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class Admin {
  //Parent Entity User attributes
  user: UserEntity;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
