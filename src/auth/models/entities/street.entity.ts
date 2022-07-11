import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('street')
export class StreetEntity {
  @PrimaryColumn()
  streetName: string;

  @OneToMany(() => CompanyEntity, (companyEntity) => companyEntity.street)
  users: CompanyEntity[];
}
