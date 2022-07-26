import { ApiProperty } from '@nestjs/swagger';

export class LoginReturnObject {
  @ApiProperty()
  token: string;
}
