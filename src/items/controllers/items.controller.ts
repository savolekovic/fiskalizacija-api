import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('items')
export class ItemsController {
  @UseGuards(JwtGuard)
  @Get()
  getHello() {
    return { hello: 'Hello World' };
  }
}
