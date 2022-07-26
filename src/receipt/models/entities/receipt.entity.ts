import { timestamp } from 'rxjs';
import { CustomerEntity } from 'src/auth/models/entities/customer.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentTypeEntity } from './payment-type.entity';
import { ReceiptItemEntity } from './receipt-to-items.entity';

@Entity('receipt')
export class ReceiptEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PaymentTypeEntity,
    (paymentTypeEntity) => paymentTypeEntity.receipts,
    { eager: true, nullable: true },
  )
  paymentType: PaymentTypeEntity;

  @ManyToOne(
    () => CustomerEntity,
    (customerEntity) => customerEntity.receipts,
    { eager: true },
  )
  customer: CustomerEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  change: number;

  //Broj slip racuna
  @Column({ nullable: true })
  receiptNumber: number;

  @Column({ default: false })
  isReceiptClosed: boolean;

  @Column({ nullable: true })
  dateOfClosure: Date;

  @OneToMany(() => ReceiptItemEntity, (receiptItems) => receiptItems.receipt)
  receiptItems!: ReceiptItemEntity[];
}
