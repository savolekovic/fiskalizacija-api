import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { UserEntity } from '../models/entities/user.entity';
import { User } from '../models/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: { id },
      }),
    ).pipe(
      map((user: User) => {
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        delete user.password;
        return user;
      }),
    );
  }

  doesUsernameExist(username: string): Observable<boolean> {
    return from(
      this.userRepository.findOne({
        where: { username },
      }),
    ).pipe(
      switchMap((user: User) => {
        return of(!!user);
      }),
    );
  }
}
