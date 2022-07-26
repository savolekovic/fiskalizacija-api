import { ApiProperty } from '@nestjs/swagger';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('company_type')
export class CompanyTypeEntity {
  @ApiProperty({ required: true })
  @PrimaryColumn()
  typeName: string;

  @OneToMany(() => CompanyEntity, (companyEntity) => companyEntity.companyType)
  users: CompanyEntity[];
}
