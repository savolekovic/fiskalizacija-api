import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNotEmpty, IsNotEmptyObject, IsNumber } from 'class-validator';
import { PaymentTypeEntity } from '../entities/payment-type.entity';

export class Receipt {
  id: number;

  @ApiProperty()
  @IsNotEmptyObject()
  paymentType: PaymentTypeEntity;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  change: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  receiptNumber: number;
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateOfClosure: Date;

  isReceiptClosed?: boolean;
}
