import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

//This DTO is the same as the entity
//Used for login and Username UNIQUE constraint check
export class User {
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
