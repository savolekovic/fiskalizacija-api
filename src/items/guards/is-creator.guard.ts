import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/auth/models/dto/user.dto';
import { UserEntity } from 'src/auth/models/entities/user.entity';
import { UserService } from 'src/auth/services/user.service';
import { ItemEntity } from '../models/entities/item.entity';
import { ItemsService } from '../services/items.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private itemsService: ItemsService,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params }: { params: { id: number } } = request;

    const jwt = request.headers.authorization.replace('Bearer ', '');
    const json = this.jwtService.decode(jwt, { json: true }) as { user: User };

    if (!params) return false;

    const userId = json.user.id;
    const itemId = params.id;

    // Determine if logged-in user is the same as the user that created the item
    return this.userService.findUserById(userId).pipe(
      switchMap((user: User) =>
        this.itemsService.findItemById(itemId, user.id).pipe(
          map((item: ItemEntity) => {
            if (!item) return false;
            return true;
          }),
        ),
      ),
    );
  }
}
