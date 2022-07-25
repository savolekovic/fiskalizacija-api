import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { from, Observable } from 'rxjs';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { DeleteResult } from 'typeorm';
import { IsCreatorGuard } from '../guards/is-creator.guard';
import { Item } from '../models/dto/item.dto';
import { ItemEntity } from '../models/entities/item.entity';
import { ItemsService } from '../services/items.service';

@Controller('items')
@ApiTags('Items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() item: Item,
    @Headers('Authorization') auth: string,
  ): Observable<ItemEntity> {
    return from(this.itemsService.create(item, auth));
  }

  @UseGuards(JwtGuard)
  @Get()
  find(
    @Query('take') take: number = 1,
    @Query('skip') skip: number = 0,
  ): Observable<ItemEntity[]> {
    take = take > 20 ? 20 : take;
    return this.itemsService.findItems(take, skip);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() item: Item,
    @Headers('Authorization') auth: string,
  ) {
    return this.itemsService.update(id, item, auth);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @Headers('Authorization') auth: string,
  ): Observable<DeleteResult> {
    return this.itemsService.remove(id, auth);
  }
}
