import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmptyObject()
  companyType: CompanyTypeEntity;

  @ApiProperty()
  @IsNotEmptyObject()
  country: CountryEntity;

  @ApiProperty()
  @IsNotEmptyObject()
  city: CityEntity;

  @IsNotEmptyObject()
  @ApiProperty()
  street: StreetEntity;

  //Company Entity attributes
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(10000000)
  @Max(99999999)
  maticniBroj: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(100000000)
  @Max(999999999)
  pib: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  streetNumber: number;

  status = false;
}
