import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PaymentTypeEntity } from '../entities/payment-type.entity';

export class Receipt {
  @IsOptional()
  paymentType: PaymentTypeEntity;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  change: number;
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  receiptNumber: number;
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isReceiptClosed: boolean;
}
