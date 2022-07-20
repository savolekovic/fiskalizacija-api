import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Headers,
  Put,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Receipt } from '../dto/receipt.dto';
import { ReceiptService } from '../services/receipt.service';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Headers('Authorization') auth: string) {
    return this.receiptService.createReceipt(auth);
  }

  @UseGuards(JwtGuard)
  @Put()
  update(@Body() receipt: Receipt, @Headers('Authorization') auth: string) {
    return this.receiptService.closeReceipt(receipt, auth);
  }

  @UseGuards(JwtGuard)
  @Get()
  find(@Headers('Authorization') auth: string) {
    return this.receiptService.findOpenReceipt(auth);
  }

  @UseGuards(JwtGuard)
  @Get('closed')
  findReceipts() {
    return this.receiptService.findClosed();
  }
}
