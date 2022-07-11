import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { AdminEntity } from './models/entities/admin.entity';
import { CityEntity } from './models/entities/city.entity';
import { CompanyTypeEntity } from './models/entities/company-type.entity';
import { CompanyEntity } from './models/entities/company.entity';
import { CountryEntity } from './models/entities/country.entity';
import { CustomerEntity } from './models/entities/customer.entity';
import { StreetEntity } from './models/entities/street.entity';
import { UserEntity } from './models/entities/user.entity';
import { AdminService } from './services/auth-admin.service';
import { CompanyService } from './services/auth-company.service';
import { CustomerService } from './services/auth-customer.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      CompanyEntity,
      AdminEntity,
      CustomerEntity,
      CompanyTypeEntity,
      CountryEntity,
      CityEntity,
      StreetEntity
    ]),
  ],
  providers: [
    UserService,
    CompanyService,
    AdminService,
    CustomerService,
    JwtGuard,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [UserService]
})
export class AuthModule {}
