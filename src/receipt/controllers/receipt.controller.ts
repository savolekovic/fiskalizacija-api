import { ReceiptItemEntity } from './../models/entities/receipt-to-items.entity';
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
  HttpCode,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ReceiptItem } from '../models/dto/receipt-to-items.dto';
import { Receipt } from '../models/dto/receipt.dto';
import { ReceiptService } from '../services/receipt.service';
import { UpdateDeleteReturnObject } from 'src/auth/models/update-return.object';

@Controller('receipt')
@ApiTags('Receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  //We dont need this ENDPOINT since the Receipt is created when the Customer adds an item to the cart.
  @ApiOperation({
    summary: 'Create new receipt or retrieve an open one if it exists.',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiCreatedResponse({ type: ReceiptEntity })
  @UseGuards(JwtGuard)
  @Post()
  createReceipt(@Headers() headers) {
    return this.receiptService.createReceipt(headers.authorization);
  }

  @ApiOperation({ summary: 'Close receipt.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UpdateDeleteReturnObject })
  @UseGuards(JwtGuard)
  @Put()
  update(@Body() receipt: Receipt, @Headers() headers) {
    return this.receiptService.closeReceipt(receipt, headers.authorization);
  }

  @ApiOperation({ summary: 'Retrieve open receipt.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReceiptEntity })
  @UseGuards(JwtGuard)
  @Get()
  find(@Headers() headers) {
    return this.receiptService.findOpenReceipt(headers.authorization);
  }

  @ApiOperation({ summary: 'Retrieve all closed receipts.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ReceiptEntity,
    isArray: true,
  })
  @UseGuards(JwtGuard)
  @Get('closed')
  findReceipts() {
    return this.receiptService.findClosed();
  }

  @ApiOperation({ summary: 'Add item to receipt.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({description: 'Bad Request'})
  @ApiOkResponse({ type: ReceiptItemEntity })
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @Post('item')
  upsertItem(@Body() receiptItem: ReceiptItem, @Headers() headers) {
    return this.receiptService.upsertReceiptItem(
      receiptItem,
      headers.authorization,
    );
  }

  @ApiOperation({ summary: 'Delete item from receipt.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UpdateDeleteReturnObject })
  @ApiOkResponse({ type: ReceiptItemEntity })
  @UseGuards(JwtGuard)
  @Delete('item/:id')
  deleteItem(@Param('id') id: number, @Headers() headers) {
    return this.receiptService.deleteReceiptItem(id, headers.authorization);
  }
}
