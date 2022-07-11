import { UserEntity } from '../entities/user.entity';

export class Customer {
  //Parent Entity User attributes
  user: UserEntity;

  username: string;
  password: string;

  //Customer Entity attributes
  //Serbia IdNumber length is 30 characters
  idNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
