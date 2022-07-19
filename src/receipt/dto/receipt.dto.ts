import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { CustomerEntity } from 'src/auth/models/entities/customer.entity';
import { PaymentTypeEntity } from '../entities/payment-type.entity';

export class Receipt {
  @IsNotEmptyObject()
  customer: CustomerEntity;

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
