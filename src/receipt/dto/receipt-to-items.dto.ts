import { IsNotEmpty, IsNumber } from "class-validator";

export class ReceiptItem {
  //We need Item primary key and Customer primary key (we get this one from the JWT)
  @IsNumber()
  @IsNotEmpty()
  itemId: number;
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
