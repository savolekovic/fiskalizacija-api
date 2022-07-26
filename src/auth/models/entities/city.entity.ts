import { ApiProperty } from '@nestjs/swagger';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('city')
export class CityEntity {
  @ApiProperty({ required: true })
  @PrimaryColumn()
  cityName: string;

  @OneToMany(() => CompanyEntity, (companyEntity) => companyEntity.city)
  users: CompanyEntity[];
}
