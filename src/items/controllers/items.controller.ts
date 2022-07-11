import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateItem } from '../models/dto/create-item.dto';
import { UpdateItem } from '../models/dto/update-item.dto';
import { ItemEntity } from '../models/entities/item.entity';
import { ItemsService } from '../services/items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() item: CreateItem): Observable<ItemEntity> {
    return from(this.itemsService.create(item));
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

  @Get(':id')
  findOne(@Param('id') id: number): Observable<ItemEntity> {
    return this.itemsService.findOne(id);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() item: UpdateItem) {
  //   return this.itemsService.update(+id, item);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.itemsService.remove(+id);
  // }
}
