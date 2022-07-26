import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';
import { inspect } from 'util';
import { UserEntity } from '../entities/user.entity';

export class Customer {
  //Parent Entity User attributes
  user: UserEntity;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  //Customer Entity attributes
  //Serbia IdNumber length is 30 characters
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Length(30, 30)
  idNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
