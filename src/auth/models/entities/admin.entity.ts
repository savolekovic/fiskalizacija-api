import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('admin')
export class AdminEntity {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: UserEntity;
}
