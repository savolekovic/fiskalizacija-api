import { CompanyEntity } from 'src/auth/models/entities/company.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ManufacturerEntity } from './manufacturer.entity';
import { TaxRateEntity } from './tax-rate.entity';
import { WarehouseEntity } from './warehouse.entity';

@Entity('item')
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  companyId: number;

  @ManyToOne(() => CompanyEntity, 
  (companyEntity) => companyEntity.items,
  { eager: true })
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company: CompanyEntity;

  @ManyToOne(
    () => ManufacturerEntity,
    (manufacturerEntity) => manufacturerEntity.items,
  )
  manufacturer: ManufacturerEntity;

  @ManyToOne(() => TaxRateEntity, (taxRateEntity) => taxRateEntity.items)
  taxRate: TaxRateEntity;

  @ManyToOne(() => WarehouseEntity, (warehouseEntity) => warehouseEntity.items)
  warehouse: WarehouseEntity;

  @Column()
  name: string;

  @Column()
  measureUnit: string;

  @Column({ nullable: true })
  countryOfOrigin: string;

  @Column({ nullable: true })
  foreignName: string;

  @Column({ type: 'bigint', nullable: true })
  barcode: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  customsRate: number;

  @Column({ nullable: true })
  applyTaxes: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  declaration: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  buyingPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sellingPrice: number;

  @Column()
  quantityInStock: number;
}
