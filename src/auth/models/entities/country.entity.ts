import { ApiProperty } from '@nestjs/swagger';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('country')
export class CountryEntity {
  @ApiProperty({ required: true })
  @PrimaryColumn()
  countryName: string;

  @OneToMany(() => CompanyEntity, (companyEntity) => companyEntity.country)
  users: CompanyEntity[];
}
