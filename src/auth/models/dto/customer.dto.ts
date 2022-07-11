import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';
import { inspect } from 'util';
import { UserEntity } from '../entities/user.entity';

export class Customer {
  //Parent Entity User attributes
  user: UserEntity;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  //Customer Entity attributes
  //Serbia IdNumber length is 30 characters
  @IsNotEmpty()
  @IsNumberString()
  @Length(30,30)
  idNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
