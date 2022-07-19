import { Module } from '@nestjs/common';
import { ReceiptService } from './services/receipt.service';
import { ReceiptController } from './controllers/receipt.controller';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService]
})
export class ReceiptModule {}
