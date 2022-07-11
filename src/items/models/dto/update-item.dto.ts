import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateItem {

  @IsNumber()
  @IsNotEmpty()
  companyId: number;


  //Required
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  measureUnit: string;
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  buyingPrice: number;
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  sellingPrice: number;
  @IsOptional()
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
