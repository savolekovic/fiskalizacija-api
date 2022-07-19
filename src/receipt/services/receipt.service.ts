import { Injectable } from '@nestjs/common';
import { Receipt } from '../dto/receipt.dto';

@Injectable()
export class ReceiptService {
  create(receipt: Receipt) {
    return 'This action adds a new receipt';
  }

  findAll() {
    return `This action returns all receipt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} receipt`;
  }

  update(id: number, receipt: Receipt) {
    return `This action updates a #${id} receipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} receipt`;
  }
}
