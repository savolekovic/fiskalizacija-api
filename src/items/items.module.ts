import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/auth/models/entities/company.entity';
import { ItemsController } from './controllers/items.controller';
import { ItemEntity } from './models/entities/item.entity';
import { ManufacturerEntity } from './models/entities/manufacturer.entity';
import { TaxRateEntity } from './models/entities/tax-rate.entity';
import { WarehouseEntity } from './models/entities/warehouse.entity';
import { ItemsService } from './services/items.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    TypeOrmModule.forFeature([
      ItemEntity,
      CompanyEntity,
      ManufacturerEntity,
      TaxRateEntity,
      WarehouseEntity,
    ]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
