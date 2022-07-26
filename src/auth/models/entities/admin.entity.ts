import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('admin')
export class AdminEntity {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @OneToOne(() => UserEntity, { cascade: true, eager: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: UserEntity;
}
