import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class Admin {
  //Parent Entity User attributes
  user: UserEntity;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({required: true})
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({required: true})
  password: string;
}
