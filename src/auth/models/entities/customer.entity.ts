import { ApiProperty } from '@nestjs/swagger';
import { ReceiptEntity } from 'src/receipt/models/entities/receipt.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('customer')
export class CustomerEntity {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @OneToOne(() => UserEntity, { cascade: true, eager: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: UserEntity;

  @ApiProperty()
  @Column({ unique: true })
  idNumber: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  phoneNumber: string;

}
