import { CityEntity } from '../entities/city.entity';
import { CompanyTypeEntity } from '../entities/company-type.entity';
import { CountryEntity } from '../entities/country.entity';
import { StreetEntity } from '../entities/street.entity';
import { UserEntity } from '../entities/user.entity';

export class Company {
  //UserEntity attributes
  user: UserEntity;

  username: string;

  password: string;

  companyType: CompanyTypeEntity;
  companyTypeName: string;

  country: CountryEntity;
  countryName: string;

  city: CityEntity;
  cityName: string;

  street: StreetEntity;
  streetName: string;

  //Company Entity attributes

  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  companyName: string;
  maticniBroj: number;
  pib: number;
  streetNumber: number;
}
