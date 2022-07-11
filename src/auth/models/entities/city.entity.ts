import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('city')
export class CityEntity {
  @PrimaryColumn()
  cityName: string;

  @OneToMany(() => CompanyEntity, (companyEntity) => companyEntity.city)
  users: CompanyEntity[];
}
