import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { Repository } from 'typeorm';
import { Admin } from '../models/dto/admin.dto';
import { User } from '../models/dto/user.dto';
import { AdminEntity } from '../models/entities/admin.entity';
import { UserEntity } from '../models/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  registerAdmin(admin: Admin): Observable<AdminEntity> {
    const { username, password } = admin;

    return this.userService.doesUsernameExist(username).pipe(
      tap((doesUsernameExist: boolean) => {
        if (doesUsernameExist)
          throw new HttpException(
            'A user has already been created with this username',
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

        admin.user = user;
        return from(this.adminRepository.save(admin));
      }),
      switchMap((adminEntity: AdminEntity) => {
        return this.findAdminById(adminEntity.id);
      }),
      map((savedAdmin: AdminEntity) => {
        delete savedAdmin.user.id;
        return savedAdmin;
      }),
    );
  }
  loginAdmin(user: User): Observable<string> {
    const { username, password } = user;
    return this.validate(username, password).pipe(
      switchMap((admin: AdminEntity) => {
        if (admin) {
          const payload = { user: admin.user };
          //create JWT - credentials
          //jwtService.signAsync returns Promise<string>
          return from(this.jwtService.signAsync(payload));
        }
      }),
    );
  }
  validate(username: string, password: string): Observable<AdminEntity> {
    return from(
      this.adminRepository
        .createQueryBuilder('admin')
        .innerJoinAndSelect('admin.user', 'user')
        .where('user.username = :username', { username: username })
        .getOne(),
    ).pipe(
      switchMap((admin: AdminEntity) => {
        if (!admin) {
          throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Invalid Credentials' },
            HttpStatus.NOT_FOUND,
          );
        }
        return from(bcrypt.compare(password, admin.user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete admin.user.password;
              return admin;
            }
          }),
        );
      }),
    );
  }

  findAdminById(id: number): Observable<AdminEntity> {
    return from(
      this.adminRepository.findOne({
        where: { id },
      }),
    ).pipe(
      map((admin: AdminEntity) => {
        if (!admin) {
          throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        }
        return admin;
      }),
    );
  }
}
