import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Headers,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { from, Observable } from 'rxjs';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateDeleteReturnObject } from 'src/auth/models/update-return.object';
import { IsCreatorGuard } from '../guards/is-creator.guard';
import { Item } from '../models/dto/item.dto';
import { ItemEntity } from '../models/entities/item.entity';
import { ItemsService } from '../services/items.service';

@Controller('items')
@ApiTags('Items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiOperation({ summary: 'Create new item.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiNotFoundResponse({description: 'Not found.'})
  @ApiForbiddenResponse({description: 'Forbidden.'})
  @ApiCreatedResponse({ type: ItemEntity })
  @ApiBody({ type: Item })
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() item: Item, @Headers() headers): Observable<ItemEntity> {
    return from(this.itemsService.create(item, headers.authorization));
  }

  @ApiOperation({ summary: 'Retrieve all company items.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiOkResponse({
    type: ItemEntity,
    isArray: true
})
  @UseGuards(JwtGuard)
  @Get(':companyId')
  find(@Param('companyId') companyId: number): Observable<ItemEntity[]> {
    return this.itemsService.findItems(companyId);
  }

  @ApiOperation({ summary: 'Update item.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiNotFoundResponse({description: 'Not found.'})
  @ApiForbiddenResponse({description: 'Forbidden.'})
  @ApiCreatedResponse({ type: UpdateDeleteReturnObject })
  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() item: Item, @Headers() headers) {
    return this.itemsService.update(id, item, headers.authorization);
  }

  @ApiOperation({ summary: 'Delete item.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiNotFoundResponse({description: 'Not found.'})
  @ApiForbiddenResponse({description: 'Forbidden.'})
  @ApiCreatedResponse({ type: UpdateDeleteReturnObject })
  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Headers() headers) {
    return this.itemsService.remove(id, headers.authorization);
  }
}
