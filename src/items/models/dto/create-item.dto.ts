import {
  IsBoolean,
  IsNotEmpty,
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
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  manufacturer: ManufacturerEntity;
  @IsString()
  @IsNotEmpty()
  manufacturerTitle: string;

  taxRate: TaxRateEntity;
  @IsString()
  @IsNotEmpty()
  taxRateName: string;

  warehouse: WarehouseEntity;
  @IsString()
  @IsNotEmpty()
  warehouseName: string;

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
  countryOfOrigin?: string;
  @IsOptional()
  @IsString()
  foreignName?: string;
  @IsOptional()
  @Length(12, 12)
  @IsNumber()
  barcode?: number;
  @IsOptional()
  @IsNumber()
  customsRate?: number;
  @IsOptional()
  @IsBoolean()
  applyTaxes?: boolean;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  declaration?: string;
}
