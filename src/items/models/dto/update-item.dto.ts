import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateItem {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  measureUnit: string;

  @IsOptional()
  @IsNumber()
  buyingPrice: number;

  @IsOptional()
  @IsNumber()
  sellingPrice: number;

  @IsOptional()
  @IsNumber()
  quantityInStock: number;

  @IsOptional()
  @IsString()
  countryOfOrigin: string;

  @IsOptional()
  @IsString()
  foreignName: string;

  @IsOptional()
  @Length(12, 12)
  @IsNumber()
  barcode: number;

  @IsOptional()
  @IsNumber()
  customsRate: number;

  @IsOptional()
  @IsBoolean()
  applyTaxes: boolean;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  declaration: string;
}
