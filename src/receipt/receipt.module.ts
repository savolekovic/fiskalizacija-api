import { Module } from '@nestjs/common';
import { ReceiptController } from './controllers/receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptEntity } from './entities/receipt.entity';
import { PaymentTypeEntity } from './entities/payment-type.entity';
import { ReceiptService } from './services/receipt.service';
import { ReceiptItemsEntity } from './entities/receipt-to-items';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReceiptEntity,
      PaymentTypeEntity,
      ReceiptItemsEntity,
    ]),
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
