import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ItemEntity } from "./item.entity";

@Entity('tax_rate')
export class TaxRateEntity{
    @PrimaryColumn()
    name: string;

    @Column()
    rate: number;

    @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.taxRate)
    items: ItemEntity[];
}