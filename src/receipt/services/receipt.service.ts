import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { User } from 'src/auth/models/dto/user.dto';
import { CustomerEntity } from 'src/auth/models/entities/customer.entity';
import { ItemEntity } from 'src/items/models/entities/item.entity';
import { Repository } from 'typeorm';
import { ReceiptItem } from '../models/dto/receipt-to-items.dto';
import { Receipt } from '../models/dto/receipt.dto';
import { PaymentTypeEntity } from '../models/entities/payment-type.entity';
import { ReceiptItemEntity } from '../models/entities/receipt-to-items.entity';
import { ReceiptEntity } from '../models/entities/receipt.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(ReceiptEntity)
    private readonly receiptRepository: Repository<ReceiptEntity>,
    @InjectRepository(PaymentTypeEntity)
    private readonly paymentTypeEntityRepository: Repository<PaymentTypeEntity>,
    @InjectRepository(ReceiptItemEntity)
    private readonly receiptItemEntityRepository: Repository<ReceiptItemEntity>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    private jwtService: JwtService,
  ) {}

  findPaymentType(title: string) {
    return from(
      this.paymentTypeEntityRepository.findOne({
        where: { title },
      }),
    );
  }

  findCustomerWithId(userId: number) {
    return from(
      this.customerRepository.findOne({
        where: { id: userId },
      }),
    );
  }

  doesCustomerHaveOpenReceipt(customer: CustomerEntity) {
    return from(
      this.receiptRepository.findOne({
        where: {
          customer: customer,
          isReceiptClosed: false,
        },
      }),
    );
  }

  getJwtUserId(jwt: string) {
    //Extract token from authorization string
    jwt = jwt.replace('Bearer ', '');
    //Decode jwt and extract payload
    const json = this.jwtService.decode(jwt, { json: true }) as { user: User };

    return json.user.id;
  }

  createReceipt(jwt: string) {
    const userId = this.getJwtUserId(jwt);
    let newReceipt = new ReceiptEntity();

    return this.findCustomerWithId(userId).pipe(
      switchMap((customer: CustomerEntity) => {
        if (!customer) {
          throw new ForbiddenException();
        }
        newReceipt.customer = customer;
        return this.doesCustomerHaveOpenReceipt(customer);
      }),
      switchMap((receipt: ReceiptEntity) => {
        if (receipt) {
          newReceipt = receipt;
        }
        return from(this.receiptRepository.save(newReceipt));
      }),
    );
  }

  findOpenReceipt(jwt: string) {
    const userId = this.getJwtUserId(jwt);

    return this.findCustomerWithId(userId).pipe(
      switchMap((customer: CustomerEntity) => {
        if (!customer) {
          throw new ForbiddenException();
        }
        return this.doesCustomerHaveOpenReceipt(customer);
      }),
      map((receipt: ReceiptEntity) => {
        if (!receipt) {
          throw new HttpException('Receipt not found.', HttpStatus.NOT_FOUND);
        }
        return receipt;
      }),
    );
  }

  closeReceipt(receipt: Receipt, jwt: string) {
    return this.findOpenReceipt(jwt).pipe(
      switchMap((receiptEntity: ReceiptEntity) => {
        if (!receiptEntity) {
          throw new HttpException('Receipt not found.', HttpStatus.NOT_FOUND);
        }
        receipt.id = receiptEntity.id;
        return this.findPaymentType(receipt.paymentType.title);
      }),
      switchMap((paymentType: PaymentTypeEntity) => {
        if (!paymentType) {
          throw new HttpException(
            'Payment type not found.',
            HttpStatus.NOT_FOUND,
          );
        }
        receipt.isReceiptClosed = true;
        return from(this.receiptRepository.update(receipt.id, receipt));
      }),
    );
  }

  findClosed() {
    return from(
      this.receiptRepository.find({
        where: { isReceiptClosed: true },
      }),
    );
  }

  addReceiptItem(receiptItem: ReceiptItem, jwt: string) {
    let newReceiptItem = new ReceiptItemEntity();
    newReceiptItem.quantity = receiptItem.quantity;

    return from(
      this.createReceipt(jwt).pipe(
        switchMap((receiptEntity: ReceiptEntity) => {
          if (!receiptEntity) throw new BadRequestException();
          newReceiptItem.receipt = receiptEntity;
          return this.findItem(receiptItem.itemId, receiptItem.companyId);
        }),
        switchMap((itemEntity: ItemEntity) => {
          if (!itemEntity)
            throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
          newReceiptItem.item = itemEntity;
          return this.checkIfItemAlreadyExists(newReceiptItem);
        }),
        switchMap((receiptItemEntity: ReceiptItemEntity) => {
          if (!receiptItemEntity)
            return this.receiptItemEntityRepository.save(newReceiptItem);
          else {
            newReceiptItem.quantity += receiptItemEntity.quantity;
            return this.receiptItemEntityRepository.update(
              receiptItemEntity.id,
              newReceiptItem,
            );
          }
        }),
      ),
    );
  }

  deleteReceiptItem(id: number, jwt: string) {
    const userId = this.getJwtUserId(jwt);

    return this.findCustomerWithId(userId).pipe(
      switchMap((customer: CustomerEntity) => {
        if (!customer) {
          throw new ForbiddenException();
        }

        return this.receiptItemEntityRepository.delete(id);
      }),
    );
  }

  checkIfItemAlreadyExists(newReceiptItem: ReceiptItemEntity) {
    return from(
      this.receiptItemEntityRepository.findOne({
        where: {
          item: newReceiptItem.item,
          receipt: newReceiptItem.receipt,
        },
      }),
    );
  }

  findItem(itemId: number, companyId: number) {
    return from(
      this.itemRepository.findOne({
        where: { id: itemId, companyId: companyId },
      }),
    );
  }
}
