import { UserEntity } from '../entities/user.entity';

export class Admin {
  //Parent Entity User attributes
  user: UserEntity;

  username: string;

  password: string;
}
