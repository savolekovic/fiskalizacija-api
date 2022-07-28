import { ApiProperty } from '@nestjs/swagger';
import { CompanyEntity } from 'src/auth/models/entities/company.entity';
import { ReceiptItemEntity } from 'src/receipt/models/entities/receipt-to-items.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ManufacturerEntity } from './manufacturer.entity';
import { TaxRateEntity } from './tax-rate.entity';
import { WarehouseEntity } from './warehouse.entity';

@Entity('item')
export class ItemEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  companyId: number;

  @ManyToOne(() => CompanyEntity, (companyEntity) => companyEntity.items)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company: CompanyEntity;

  @ApiProperty()
  @ManyToOne(
    () => ManufacturerEntity,
    (manufacturerEntity) => manufacturerEntity.items,
    { eager: true },
  )
  manufacturer: ManufacturerEntity;

  @ApiProperty()
  @ManyToOne(() => TaxRateEntity, (taxRateEntity) => taxRateEntity.items, {
    eager: true,
  })
  taxRate: TaxRateEntity;

  @ApiProperty()
  @ManyToOne(
    () => WarehouseEntity,
    (warehouseEntity) => warehouseEntity.items,
    { eager: true },
  )
  warehouse: WarehouseEntity;

  //Required
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  measureUnit: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  buyingPrice: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sellingPrice: number;

  @ApiProperty()
  @Column()
  quantityInStock: number;

  //Optional
  @ApiProperty({required: false})
  @Column({ nullable: true })
  countryOfOrigin: string;

  @ApiProperty({required: false})
  @Column({ nullable: true })
  foreignName: string;

  @ApiProperty({required: false})
  @Column({ type: 'bigint', nullable: true })
  barcode: number;

  @ApiProperty({required: false})
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  customsRate: number;

  @ApiProperty({required: false})
  @Column({ nullable: true })
  applyTaxes: boolean;

  @ApiProperty({required: false})
  @Column({ nullable: true })
  description: string;

  @ApiProperty({required: false})
  @Column({ nullable: true })
  declaration: string;

  @ApiProperty({required: false})
  @OneToMany(() => ReceiptItemEntity, (receiptItems) => receiptItems.item)
  receiptItems!: ReceiptItemEntity[];
}
