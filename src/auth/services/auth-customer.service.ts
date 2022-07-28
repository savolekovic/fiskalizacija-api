import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../models/dto/user.dto';
import { CustomerEntity } from '../models/entities/customer.entity';
import { UserEntity } from '../models/entities/user.entity';
import { Customer } from '../models/dto/customer.dto';

import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  register(customer: Customer): Observable<CustomerEntity> {
    const { username, password, idNumber } = customer;

    return this.userService.doesUsernameExist(username).pipe(
      tap((doesUsernameExist: boolean) => {
        if (doesUsernameExist)
          throw new HttpException(
            'A user has already been created with this username',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.doesIdNumberExist(idNumber);
      }),
      tap((doesIdNumberExist: boolean) => {
        if (doesIdNumberExist)
          throw new HttpException(
            'A user has already been created with this ID number',
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

        customer.user = user;
        return from(this.customerRepository.save(customer));
      }),
      switchMap((customerEntity: CustomerEntity) => {
        return this.findCustomerById(customerEntity.id);
      }),
      map((savedCustomer: CustomerEntity) => {
        delete savedCustomer.user.id;
        delete savedCustomer.user.password;
        return savedCustomer;
      }),
    );
  }
  login(user: User): Observable<string> {
    const { username, password } = user;
    return this.validate(username, password).pipe(
      switchMap((customer: CustomerEntity) => {
        if (customer) {
          const payload = { user: customer.user };
          //create JWT - credentials
          //jwtService.signAsync returns Promise<string>
          return from(this.jwtService.signAsync(payload));
        }
      }),
    );
  }
  validate(username: string, password: string): Observable<CustomerEntity> {
    return from(
      this.customerRepository
        .createQueryBuilder('customer')
        .innerJoinAndSelect('customer.user', 'user')
        .where('user.username = :username', { username: username })
        .getOne(),
    ).pipe(
      switchMap((customer: CustomerEntity) => {
        if (!customer) {
          throw new HttpException('Invalid Credentials', HttpStatus.NOT_FOUND);
        }
        return from(bcrypt.compare(password, customer.user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) return customer;
          }),
        );
      }),
    );
  }

  doesIdNumberExist(idNumber: string): Observable<boolean> {
    return from(
      this.customerRepository.findOne({
        where: { idNumber },
      }),
    ).pipe(
      switchMap((customer: CustomerEntity) => {
        return of(!!customer);
      }),
    );
  }

  findCustomerById(id: number): Observable<CustomerEntity> {
    return from(
      this.customerRepository.findOne({
        where: { id },
      }),
    );
  }
}
