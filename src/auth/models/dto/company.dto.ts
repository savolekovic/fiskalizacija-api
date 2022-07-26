import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CityEntity } from '../entities/city.entity';
import { CompanyTypeEntity } from '../entities/company-type.entity';
import { CountryEntity } from '../entities/country.entity';
import { StreetEntity } from '../entities/street.entity';
import { UserEntity } from '../entities/user.entity';

export class Company {
  //UserEntity attributes
  user: UserEntity;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmptyObject()
  companyType: CompanyTypeEntity;
  @IsNotEmptyObject()
  country: CountryEntity;
  @IsNotEmptyObject()
  city: CityEntity;
  @IsNotEmptyObject()
  street: StreetEntity;

  //Company Entity attributes
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(10000000)
  @Max(99999999)
  maticniBroj: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(100000000)
  @Max(999999999)
  pib: number;

  @IsNumber()
  @IsNotEmpty()
  streetNumber: number;

  status = false;
}
