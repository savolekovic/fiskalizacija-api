import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeleteReturnObject {
  @ApiProperty()
  affected: number;
}
