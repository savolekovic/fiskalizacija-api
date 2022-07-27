import { ReceiptEntity } from '../models/entities/receipt.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Headers,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ReceiptItem } from '../models/dto/receipt-to-items.dto';
import { Receipt } from '../models/dto/receipt.dto';
import { ReceiptService } from '../services/receipt.service';

@Controller('receipt')
@ApiTags('Receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  //We dont need this ENDPOINT since the Receipt is created when the Customer adds an item to the cart.
  @ApiCreatedResponse({ type: ReceiptEntity })
  @UseGuards(JwtGuard)
  @Post()
  createReceipt(@Headers() headers) {
    return this.receiptService.createReceipt(headers.authorization);
  }

  @UseGuards(JwtGuard)
  @Put()
  update(@Body() receipt: Receipt, @Headers() headers) {
    return this.receiptService.closeReceipt(receipt, headers.authorization);
  }

  @UseGuards(JwtGuard)
  @Get()
  find(@Headers() headers) {
    return this.receiptService.findOpenReceipt(headers.authorization);
  }

  @UseGuards(JwtGuard)
  @Get('closed')
  findReceipts() {
    return this.receiptService.findClosed();
  }

  @UseGuards(JwtGuard)
  @Post('item')
  addItem(
    @Body() receiptItem: ReceiptItem,
    @Headers() headers,
  ) {
    return this.receiptService.addReceiptItem(receiptItem, headers.authorization);
  }

  @UseGuards(JwtGuard)
  @Delete('item/:id')
  deleteItem(@Param('id') id: number, @Headers() headers) {
    return this.receiptService.deleteReceiptItem(id, headers.authorization);
  }
}
