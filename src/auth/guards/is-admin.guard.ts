import { AdminEntity } from './../models/entities/admin.entity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { map, Observable } from 'rxjs';
import { User } from '../models/dto/user.dto';
import { AdminService } from '../services/auth-admin.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const jwt = request.headers.authorization.replace('Bearer ', '');
    const json = this.jwtService.decode(jwt, { json: true }) as { user: User };

    const userId = json.user.id;

    // Determine if logged-in user is admin
    return this.adminService.findAdminById(userId).pipe(
      map((admin: AdminEntity) => {
        if (!admin) return false;
        return true;
      }),
    );
  }
}
