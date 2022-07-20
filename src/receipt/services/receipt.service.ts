import {
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
import { Repository } from 'typeorm';
import { Receipt } from '../dto/receipt.dto';
import { PaymentTypeEntity } from '../entities/payment-type.entity';
import { ReceiptEntity } from '../entities/receipt.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(ReceiptEntity)
    private readonly receiptRepository: Repository<ReceiptEntity>,
    @InjectRepository(PaymentTypeEntity)
    private readonly paymentTypeEntityRepository: Repository<PaymentTypeEntity>,
    private jwtService: JwtService,
  ) {}

  createReceipt(jwt: string) {
    const userId = this.getJwtUserId(jwt);
    var newReceipt = new ReceiptEntity();

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

  getJwtUserId(jwt: string) {
    //Extract token from authorization string
    jwt = jwt.replace('Bearer ', '');
    //Decode jwt and extract payload
    const json = this.jwtService.decode(jwt, { json: true }) as { user: User };

    return json.user.id;
  }
}
