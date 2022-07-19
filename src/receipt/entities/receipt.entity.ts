import { CustomerEntity } from 'src/auth/models/entities/customer.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentTypeEntity } from './payment-type.entity';

@Entity('receipt')
export class ReceiptEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PaymentTypeEntity,
    (paymentTypeEntity) => paymentTypeEntity.receipts,
    { eager: true , nullable: true},
  )
  paymentType: PaymentTypeEntity;

  @ManyToOne(
    () => CustomerEntity,
    (customerEntity) => customerEntity.receipts,
    { eager: true , nullable: true},
  )
  customer: CustomerEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  change: number;

  //Broj slip racuna
  @Column({ nullable: true })
  receiptNumber: number;

  @Column({ nullable: true })
  isReceiptClosed: boolean;
}
