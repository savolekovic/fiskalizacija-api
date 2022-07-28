import { Module } from '@nestjs/common';
import { ReceiptController } from './controllers/receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptEntity } from './models/entities/receipt.entity';
import { PaymentTypeEntity } from './models/entities/payment-type.entity';
import { ReceiptService } from './services/receipt.service';
import { ReceiptItemEntity } from './models/entities/receipt-to-items.entity';
import { JwtModule } from '@nestjs/jwt';
import { ItemEntity } from 'src/items/models/entities/item.entity';
import { CompanyEntity } from 'src/auth/models/entities/company.entity';

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
      CompanyEntity,
      ItemEntity,
    ]),
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
