//This DTO is the same as the entity
//Used for login and Username UNIQUE constraint check
export class User {
  id: number;

  username: string;
  password: string;
}
