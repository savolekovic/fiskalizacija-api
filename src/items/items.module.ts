import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CompanyEntity } from 'src/auth/models/entities/company.entity';
import { ItemsController } from './controllers/items.controller';
import { IsCreatorGuard } from './guards/is-creator.guard';
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
    AuthModule
  ],
  controllers: [ItemsController],
  providers: [ItemsService, IsCreatorGuard],
})
export class ItemsModule {}
