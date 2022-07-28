import { ApiProperty } from "@nestjs/swagger";
import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ReceiptEntity } from "./receipt.entity";

@Entity('payment-type')
export class PaymentTypeEntity{
    @ApiProperty()
    @PrimaryColumn()
    title: string;

    @OneToMany(() => ReceiptEntity, (receiptEntity) => receiptEntity.paymentType)
    receipts: ReceiptEntity[];

}