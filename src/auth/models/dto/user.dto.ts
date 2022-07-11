import { IsNotEmpty, IsString } from 'class-validator';

//This DTO is the same as the entity
//Used for login and Username UNIQUE constraint check
export class User {
  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;
}
