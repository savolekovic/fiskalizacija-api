import { ApiProperty } from '@nestjs/swagger';
import { ItemEntity } from 'src/items/models/entities/item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { CityEntity } from './city.entity';
import { CompanyTypeEntity } from './company-type.entity';
import { CountryEntity } from './country.entity';
import { StreetEntity } from './street.entity';
import { UserEntity } from './user.entity';

@Entity('company')
export class CompanyEntity {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @OneToOne(() => UserEntity, { cascade: true, eager: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.company)
  items: ItemEntity[];

  @ApiProperty()
  @ManyToOne(
    () => CompanyTypeEntity,
    (companyTypeEntity) => companyTypeEntity.users,
    { eager: true },
  )
  companyType: CompanyTypeEntity;

  @ApiProperty()
  @ManyToOne(() => CountryEntity, (countryEntity) => countryEntity.users, {
    eager: true,
  })
  country: CountryEntity;

  @ApiProperty()
  @ManyToOne(() => CityEntity, (cityEntity) => cityEntity.users, {
    eager: true,
  })
  city: CityEntity;

  @ApiProperty()
  @ManyToOne(() => StreetEntity, (streetEntity) => streetEntity.users, {
    cascade: true,
    eager: true,
  })
  street: StreetEntity;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  phoneNumber: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  companyName: string;

  @ApiProperty()
  @Column()
  maticniBroj: number;

  @ApiProperty()
  @Column()
  pib: number;

  @ApiProperty()
  @Column()
  streetNumber: number;

  @Column({ default: false })
  status: boolean;
}
