import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CompanyEntity } from 'src/auth/models/entities/company.entity';
import { ManufacturerEntity } from '../entities/manufacturer.entity';
import { TaxRateEntity } from '../entities/tax-rate.entity';
import { WarehouseEntity } from '../entities/warehouse.entity';

export class CreateItem {
  company: CompanyEntity;

  @IsNotEmptyObject()
  manufacturer: ManufacturerEntity;
  @IsNotEmptyObject()
  taxRate: TaxRateEntity;
  @IsNotEmptyObject()
  warehouse: WarehouseEntity;

  //Required
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  measureUnit: string;
  @IsNumber()
  @IsNotEmpty()
  buyingPrice: number;
  @IsNumber()
  @IsNotEmpty()
  sellingPrice: number;
  @IsNumber()
  @IsNotEmpty()
  quantityInStock: number;

  //Optional
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  countryOfOrigin?: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  foreignName?: string;
  @IsOptional()
  @Length(12, 12)
  @IsNumber()
  @IsNotEmpty()
  barcode?: number;
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  customsRate?: number;
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  applyTaxes?: boolean;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  declaration?: string;
}
