import { CompanyEntity } from 'src/auth/models/entities/company.entity';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, switchMap } from 'rxjs';
import { User } from 'src/auth/models/dto/user.dto';
import { ItemEntity } from 'src/items/models/entities/item.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ReceiptItem } from '../models/dto/receipt-to-items.dto';
import { Receipt } from '../models/dto/receipt.dto';
import { PaymentTypeEntity } from '../models/entities/payment-type.entity';
import { ReceiptItemEntity } from '../models/entities/receipt-to-items.entity';
import { ReceiptEntity } from '../models/entities/receipt.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
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

  findCompanyWithId(userId: number) {
    return from(
      this.companyRepository.findOne({
        where: { id: userId },
      }),
    );
  }

  doesCompanyHaveOpenReceipt(company: CompanyEntity) {
    return from(
      this.receiptRepository.findOne({
        where: {
          company: company,
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

    return this.findCompanyWithId(userId).pipe(
      switchMap((company: CompanyEntity) => {
        if (!company) {
          throw new ForbiddenException();
        }
        newReceipt.company = company;
        return this.doesCompanyHaveOpenReceipt(company);
      }),
      switchMap((receipt: ReceiptEntity) => {
        if (receipt) {
          newReceipt = receipt;
        }
        return from(this.receiptRepository.save(newReceipt));
      }),
      switchMap((savedReceipt: ReceiptEntity) => {
        return from(
          this.receiptRepository.findOneOrFail({
            where: { id: savedReceipt.id },
          }),
        );
      }),
    );
  }

  findOpenReceipt(jwt: string) {
    const userId = this.getJwtUserId(jwt);

    return this.findCompanyWithId(userId).pipe(
      switchMap((company: CompanyEntity) => {
        if (!company) {
          throw new ForbiddenException();
        }
        return this.doesCompanyHaveOpenReceipt(company);
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
      map((updateResult: UpdateResult) => {
        return { affected: updateResult.affected };
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

  upsertReceiptItem(receiptItem: ReceiptItem, auth: string) {
    let newReceiptItem = new ReceiptItemEntity();
    newReceiptItem.quantity = receiptItem.quantity;

    return from(
      this.createReceipt(auth).pipe(
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
            receiptItemEntity.quantity += newReceiptItem.quantity;
            return this.receiptItemEntityRepository
              .update(receiptItemEntity.id, receiptItemEntity)
              .then((_) => {
                return receiptItemEntity;
              });
          }
        }),
      ),
    );
  }

  deleteReceiptItem(id: number, jwt: string) {
    const userId = this.getJwtUserId(jwt);

    return this.findCompanyWithId(userId).pipe(
      switchMap((company: CompanyEntity) => {
        if (!company) {
          throw new ForbiddenException();
        }

        return this.receiptItemEntityRepository.delete(id);
      }),
      map((deleteResult: DeleteResult) => {
        return { affected: deleteResult.affected };
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
