import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class ReceiptItem {
  //We need Item primary key and Customer primary key (we get this one from the JWT)
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  itemId: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
