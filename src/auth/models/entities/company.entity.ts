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
  @PrimaryColumn()
  id: number;

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.company)
    items: ItemEntity[];

  @ManyToOne(
    () => CompanyTypeEntity,
    (companyTypeEntity) => companyTypeEntity.users,
  )
  companyType: CompanyTypeEntity;

  @ManyToOne(() => CountryEntity, (countryEntity) => countryEntity.users)
  country: CountryEntity;

  @ManyToOne(() => CityEntity, (cityEntity) => cityEntity.users)
  city: CityEntity;

  @ManyToOne(() => StreetEntity, (streetEntity) => streetEntity.users, {
    cascade: true,
  })
  street: StreetEntity;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  companyName: string;

  @Column()
  maticniBroj: number;

  @Column()
  pib: number;

  @Column()
  streetNumber: number;

  @Column({ default: false })
  status: boolean;
}
