import { ApiProperty } from '@nestjs/swagger';

export class UpdateReturnObject {
  @ApiProperty()
  affected: number;
}
