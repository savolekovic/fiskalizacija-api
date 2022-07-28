import { CompanyEntity } from './../../../auth/models/entities/company.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentTypeEntity } from './payment-type.entity';
import { ReceiptItemEntity } from './receipt-to-items.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('receipt')
export class ReceiptEntity {
@ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  companyId: number;

  @ApiProperty({nullable: true})
  @ManyToOne(
    () => PaymentTypeEntity,
    (paymentTypeEntity) => paymentTypeEntity.receipts,
    { eager: true, nullable: true },
  )
  paymentType: PaymentTypeEntity;

  @ManyToOne(() => CompanyEntity, (companyEntity) => companyEntity.receipts)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company: CompanyEntity;

  @ApiProperty({nullable: true})
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @ApiProperty({nullable: true})
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  change: number;

  @ApiProperty({nullable: true})
  //Broj slip racuna
  @Column({ nullable: true })
  receiptNumber: number;

  @ApiProperty()
  @Column({ default: false })
  isReceiptClosed: boolean;

  @ApiProperty({nullable: true})
  @Column({ nullable: true })
  dateOfClosure: Date;

  @OneToMany(() => ReceiptItemEntity, (receiptItems) => receiptItems.receipt)
  receiptItems!: ReceiptItemEntity[];
}
