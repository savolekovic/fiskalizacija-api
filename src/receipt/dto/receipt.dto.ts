import { IsNotEmpty, IsNotEmptyObject, IsNumber } from 'class-validator';
import { PaymentTypeEntity } from '../entities/payment-type.entity';

export class Receipt {
  id: number;

  @IsNotEmptyObject()
  paymentType: PaymentTypeEntity;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
  @IsNumber()
  @IsNotEmpty()
  change: number;
  @IsNumber()
  @IsNotEmpty()
  receiptNumber: number;

  isReceiptClosed?: boolean;
}
