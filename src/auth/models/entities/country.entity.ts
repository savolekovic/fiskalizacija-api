import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('country')
export class CountryEntity {
  @PrimaryColumn()
  countryName: string;

  @OneToMany(() => CompanyEntity, (companyEntity) => companyEntity.country)
  users: CompanyEntity[];
}
