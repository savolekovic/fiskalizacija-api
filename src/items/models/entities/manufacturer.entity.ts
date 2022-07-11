import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ItemEntity } from "./item.entity";

@Entity('manufacturer')
export class ManufacturerEntity{
    @PrimaryColumn()
    title: string;

    @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.manufacturer)
    items: ItemEntity[];
}