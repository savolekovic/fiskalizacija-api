import { ApiProperty } from '@nestjs/swagger';
import { ItemEntity } from 'src/items/models/entities/item.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReceiptEntity } from './receipt.entity';

@Entity('receipt_items')
export class ReceiptItemEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => ReceiptEntity })
  @ManyToOne(() => ReceiptEntity, (receipt) => receipt.receiptItems, {
    eager: true,
  })
  receipt: ReceiptEntity;

  @ApiProperty({ type: () => ItemEntity })
  @ManyToOne(() => ItemEntity, (item) => item.receiptItems, { eager: true })
  item: ItemEntity;

  @ApiProperty()
  @Column()
  quantity: number;
}
