import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { Company } from '../models/dto/company.dto';
import { User } from '../models/dto/user.dto';
import { UserEntity } from '../models/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { StreetEntity } from '../models/entities/street.entity';
import { CompanyTypeEntity } from '../models/entities/company-type.entity';
import { CountryEntity } from '../models/entities/country.entity';
import { CityEntity } from '../models/entities/city.entity';
import { UserService } from './user.service';
import { CompanyEntity } from '../models/entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(CompanyTypeEntity)
    private readonly companyTypeRepository: Repository<CompanyTypeEntity>,
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(StreetEntity)
    private readonly streetRepository: Repository<StreetEntity>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  register(company: Company): Observable<CompanyEntity> {
    const { username, password, email, companyType, country, city, street } =
      company;

    return this.userService.doesUsernameExist(username).pipe(
      tap((doesUsernameExist: boolean) => {
        if (doesUsernameExist)
          throw new HttpException(
            'A user has already been created with this username',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.doesEmailExist(email);
      }),
      tap((doesEmailExist: boolean) => {
        if (doesEmailExist)
          throw new HttpException(
            'A user has already been created with this email',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.userService.hashPassword(password);
      }),
      switchMap((hashedPassword: string) => {
        const user = new UserEntity();
        user.username = username;
        user.password = hashedPassword;
        company.user = user;

        return this.findCompanyType(companyType.typeName);
      }),
      switchMap((companyTypeEntity: CompanyTypeEntity) => {
        if (!companyTypeEntity) {
          throw new HttpException(
            'Company type not found.',
            HttpStatus.NOT_FOUND,
          );
        }
        company.companyType = companyTypeEntity;

        return this.findCountry(country.countryName);
      }),
      switchMap((countryEntity: CountryEntity) => {
        if (!countryEntity) {
          throw new HttpException('Country not found.', HttpStatus.NOT_FOUND);
        }
        company.country = countryEntity;

        return this.findCity(city.cityName);
      }),
      switchMap((cityEntity: CityEntity) => {
        if (!cityEntity) {
          throw new HttpException('City not found.', HttpStatus.NOT_FOUND);
        }

        company.city = cityEntity;
        return this.findStreet(street.streetName);
      }),
      switchMap((streetEntity: StreetEntity) => {
        if (!streetEntity) {
          const newStreetEntity = new StreetEntity();
          newStreetEntity.streetName = street.streetName;

          company.street = newStreetEntity;
        } else {
          company.street = streetEntity;
        }
        //Status is always false on registration(needs admin approval)
        company.status = false;
        //Save Company and all other entities (cascade set) to the DB
        return from(this.companyRepository.save(company)).pipe(
          switchMap((companyEntity: CompanyEntity) => {
            return this.findCompanyById(companyEntity.id);
          }),
          map((savedCompany: CompanyEntity) => {
            delete savedCompany.user.id;
            return savedCompany;
          }),
        );
      }),
    );
  }
  login(user: User): Observable<string> {
    const { username, password } = user;
    return this.validate(username, password).pipe(
      switchMap((company: CompanyEntity) => {
        if (company) {
          const payload = { user: company.user };
          //create JWT - credentials
          //jwtService.signAsync returns Promise<string>
          return from(this.jwtService.signAsync(payload));
        }
      }),
    );
  }
  validate(username: string, password: string): Observable<CompanyEntity> {
    return from(
      this.companyRepository
        .createQueryBuilder('company')
        .innerJoinAndSelect('company.user', 'user')
        .where('user.username = :username', { username: username })
        .getOne(),
    ).pipe(
      switchMap((company: CompanyEntity) => {
        if (!company)
          throw new HttpException('Invalid Credentials', HttpStatus.NOT_FOUND);

        if (!company.status)
          throw new HttpException(
            'Company account disabled',
            HttpStatus.FORBIDDEN,
          );
        return from(bcrypt.compare(password, company.user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) return company;
          }),
        );
      }),
    );
  }

  findCompanyById(id: number): Observable<CompanyEntity> {
    return from(
      this.companyRepository.findOne({
        where: { id },
      }),
    ).pipe(
      map((company: CompanyEntity) => {
        if (!company) {
          throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
        }
        return company;
      }),
    );
  }

  doesEmailExist(email: string): Observable<boolean> {
    return from(
      this.companyRepository.findOne({
        where: { email },
      }),
    ).pipe(
      switchMap((company: CompanyEntity) => {
        return of(!!company);
      }),
    );
  }

  findCompanyType(type: string): Observable<CompanyTypeEntity> {
    return from(
      this.companyTypeRepository.findOne({
        where: { typeName: type },
      }),
    );
  }

  findCountry(country: string): Observable<CountryEntity> {
    return from(
      this.countryRepository.findOne({
        where: { countryName: country },
      }),
    );
  }

  findCity(city: string): Observable<CityEntity> {
    return from(
      this.cityRepository.findOne({
        where: { cityName: city },
      }),
    );
  }

  //If there is no street with that name, create new one.
  findStreet(streetName: string): Observable<StreetEntity> {
    return from(
      this.streetRepository.findOne({
        where: { streetName },
      }),
    );
  }

  enableDisable(companyId: number, newStatus: boolean) {
    return from(
      this.companyRepository.findOne({
        where: { id: companyId },
      }),
    ).pipe(
      switchMap((company: CompanyEntity) => {
        if (!company)
          throw new HttpException('Company not found.', HttpStatus.NOT_FOUND);
        return this.companyRepository.update(company.id, { status: newStatus });
      }),
      map((updateResult: UpdateResult) => {
        return { affected: updateResult.affected };
      }),
    );
  }
}
