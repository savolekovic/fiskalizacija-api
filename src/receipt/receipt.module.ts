import { Module } from '@nestjs/common';
import { ReceiptController } from './controllers/receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptEntity } from './entities/receipt.entity';
import { PaymentTypeEntity } from './entities/payment-type.entity';
import { ReceiptService } from './services/receipt.service';
import { ReceiptItemEntity } from './entities/receipt-to-items.entity';
import { JwtModule } from '@nestjs/jwt';
import { CustomerEntity } from 'src/auth/models/entities/customer.entity';
import { ItemEntity } from 'src/items/models/entities/item.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    TypeOrmModule.forFeature([
      ReceiptEntity,
      PaymentTypeEntity,
      ReceiptItemEntity,
      CustomerEntity,
      ItemEntity,
    ]),
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
