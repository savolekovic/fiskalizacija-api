import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Receipt } from '../dto/receipt.dto';
import { ReceiptService } from '../services/receipt.service';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  create(@Body() receipt: Receipt) {
    return this.receiptService.create(receipt);
  }

  @Get()
  findAll() {
    return this.receiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() receipt: Receipt) {
    return this.receiptService.update(+id, receipt);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receiptService.remove(+id);
  }
}
