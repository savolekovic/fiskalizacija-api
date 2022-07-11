import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ItemEntity } from './item.entity';

@Entity('warehouse')
export class WarehouseEntity {
  @PrimaryColumn()
  name: string;

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.warehouse)
  items: ItemEntity[];
}
