import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('customer')
export class CustomerEntity {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ unique: true })
  idNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;
}
