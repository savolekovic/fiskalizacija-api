import { ApiProperty } from '@nestjs/swagger';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('street')
export class StreetEntity {
  @ApiProperty()
  @PrimaryColumn()
  streetName: string;

  @OneToMany(() => CompanyEntity, (companyEntity) => companyEntity.street)
  users: CompanyEntity[];
}
