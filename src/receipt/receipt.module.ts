import { Module } from '@nestjs/common';
import { ReceiptController } from './controllers/receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptEntity } from './entities/receipt.entity';
import { PaymentTypeEntity } from './entities/payment-type.entity';
import { ReceiptService } from './services/receipt.service';
import { ReceiptItemsEntity } from './entities/receipt-to-items';
import { JwtModule } from '@nestjs/jwt';
import { CustomerEntity } from 'src/auth/models/entities/customer.entity';

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
      ReceiptItemsEntity,
      CustomerEntity,
    ]),
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
