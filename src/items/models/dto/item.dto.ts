import { ApiProperty } from '@nestjs/swagger';
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

export class Item {
  company: CompanyEntity;

  @ApiProperty()
  @IsNotEmptyObject()
  manufacturer: ManufacturerEntity;
  @ApiProperty()
  @IsNotEmptyObject()
  taxRate: TaxRateEntity;
  @ApiProperty()
  @IsNotEmptyObject()
  warehouse: WarehouseEntity;

  //Required
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  measureUnit: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  buyingPrice: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sellingPrice: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantityInStock: number;

  //Optional
  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  countryOfOrigin?: string;
  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  foreignName?: string;
  @ApiProperty({required: false})
  @IsOptional()
  @Length(12, 12)
  @IsNumber()
  @IsNotEmpty()
  barcode?: number;
  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  customsRate?: number;
  @ApiProperty({required: false})
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  applyTaxes?: boolean;
  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  declaration?: string;
}
