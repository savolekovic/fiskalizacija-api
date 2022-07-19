import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { from, Observable, skip, switchMap } from 'rxjs';
import { User } from 'src/auth/models/dto/user.dto';
import { CompanyEntity } from 'src/auth/models/entities/company.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateItem } from '../models/dto/create-item.dto';
import { UpdateItem } from '../models/dto/update-item.dto';
import { ItemEntity } from '../models/entities/item.entity';
import { ManufacturerEntity } from '../models/entities/manufacturer.entity';
import { TaxRateEntity } from '../models/entities/tax-rate.entity';
import { WarehouseEntity } from '../models/entities/warehouse.entity';

@Injectable()
export class ItemsService {
  jwtUtil: any;
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(ManufacturerEntity)
    private readonly manufacturerRepository: Repository<ManufacturerEntity>,
    @InjectRepository(TaxRateEntity)
    private readonly taxRateRepository: Repository<TaxRateEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepository: Repository<WarehouseEntity>,
    private jwtService: JwtService,
  ) {}

  findCompany(companyId: number): Observable<CompanyEntity> {
    return from(
      this.companyRepository.findOne({
        where: { id: companyId },
      }),
    );
  }

  findTaxRate(taxRateName: string): Observable<TaxRateEntity> {
    return from(
      this.taxRateRepository.findOne({
        where: { name: taxRateName },
      }),
    );
  }

  findManufacturer(manufacturerTitle: string): Observable<ManufacturerEntity> {
    return from(
      this.manufacturerRepository.findOne({
        where: { title: manufacturerTitle },
      }),
    );
  }

  findWarehouse(warehouseName: string): Observable<WarehouseEntity> {
    return from(
      this.warehouseRepository.findOne({
        where: { name: warehouseName },
      }),
    );
  }

  create(item: CreateItem, jwt: string): Observable<ItemEntity> {
    const companyId = this.getJwtUserId(jwt);

    return this.findCompany(companyId).pipe(
      switchMap((company: CompanyEntity) => {
        if (!company) {
          throw new HttpException('Company not found.', HttpStatus.NOT_FOUND);
        }
        item.company = company;
        return this.findManufacturer(item.manufacturer.title);
      }),
      switchMap((manufacturer: ManufacturerEntity) => {
        if (!manufacturer) {
          throw new HttpException(
            'Manufacturer not found.',
            HttpStatus.NOT_FOUND,
          );
        }
        item.manufacturer = manufacturer;
        return this.findTaxRate(item.taxRate.name);
      }),
      switchMap((taxRate: TaxRateEntity) => {
        if (!taxRate) {
          throw new HttpException('Tax rate not found.', HttpStatus.NOT_FOUND);
        }
        item.taxRate = taxRate;
        return this.findWarehouse(item.warehouse.name);
      }),
      switchMap((warehouse: WarehouseEntity) => {
        if (!warehouse) {
          throw new HttpException('Warehouse not found.', HttpStatus.NOT_FOUND);
        }
        item.warehouse = warehouse;
        return from(this.itemRepository.save(item));
      }),
    );
  }

  findItems(take: number, skip: number): Observable<ItemEntity[]> {
    return from(
      //We can use like this if we put {eager: true} on the relation
      this.itemRepository.find({ take, skip }),
      // .createQueryBuilder('item')
      // .innerJoinAndSelect('item.company', 'company')
      // .orderBy('item.id', 'DESC')
      // .take(take)
      // .skip(skip)
      // .getMany(),
    );
  }

  findItemById(id: number, companyId: number): Observable<ItemEntity> {
    return from(
      this.itemRepository.findOneBy({
        id,
        companyId,
      }),
    );
  }

  update(id: number, item: CreateItem, jwt: string) {
    const itemPK = { id, companyId: this.getJwtUserId(jwt) };

    return this.findItemById(id, itemPK.companyId).pipe(
      switchMap((ItemEntity: ItemEntity) => {
        if (!ItemEntity) {
          throw new HttpException('Item not found.', HttpStatus.NOT_FOUND);
        }
        return this.findManufacturer(item.manufacturer.title);
      }),
      switchMap((manufacturer: ManufacturerEntity) => {
        if (!manufacturer) {
          throw new HttpException(
            'Manufacturer not found.',
            HttpStatus.NOT_FOUND,
          );
        }
        item.manufacturer = manufacturer;
        return this.findTaxRate(item.taxRate.name);
      }),
      switchMap((taxRate: TaxRateEntity) => {
        if (!taxRate) {
          throw new HttpException('Tax rate not found.', HttpStatus.NOT_FOUND);
        }
        item.taxRate = taxRate;
        return this.findWarehouse(item.warehouse.name);
      }),
      switchMap((warehouse: WarehouseEntity) => {
        if (!warehouse) {
          throw new HttpException('Warehouse not found.', HttpStatus.NOT_FOUND);
        }
        item.warehouse = warehouse;
        return from(this.itemRepository.update(itemPK, item));
      }),
    );
  }

  remove(id: number, jwt: string): Observable<DeleteResult> {
    const itemPK = { id: id, companyId: this.getJwtUserId(jwt) };
    return from(this.itemRepository.delete(itemPK));
  }

  getJwtUserId(jwt: string) {
    //Extract token from authorization string
    jwt = jwt.replace('Bearer ', '');
    //Decode jwt and extract payload
    const json = this.jwtService.decode(jwt, { json: true }) as { user: User };
    return json.user.id;
  }
}
