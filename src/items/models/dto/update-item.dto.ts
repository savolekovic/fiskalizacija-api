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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  countryOfOrigin: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  foreignName: string;

  @IsOptional()
  @Length(12, 12)
  @IsNumber()
  @IsNotEmpty()
  barcode: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  customsRate: number;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  applyTaxes: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  declaration: string;
}
