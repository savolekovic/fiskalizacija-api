import { ItemEntity } from 'src/items/models/entities/item.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReceiptEntity } from './receipt.entity';

@Entity('receipt_items')
export class ReceiptItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ReceiptEntity, (receipt) => receipt.receiptItems)
  receipt: ReceiptEntity;

  @ManyToOne(() => ItemEntity, (item) => item.receiptItems)
  item: ItemEntity;

  @Column()
  quantity: number;
}
