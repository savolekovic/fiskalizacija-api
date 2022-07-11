import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../models/entities/user.entity';
import { User } from '../models/dto/user.dto';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

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

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

}
