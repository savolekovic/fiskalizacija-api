import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { JwtGuard } from '../guards/jwt.guard';
import { Admin } from '../models/dto/admin.dto';
import { Company } from '../models/dto/company.dto';
import { Customer } from '../models/dto/customer.dto';
import { User } from '../models/dto/user.dto';
import { AdminEntity } from '../models/entities/admin.entity';
import { CompanyEntity } from '../models/entities/company.entity';
import { AdminService } from '../services/auth-admin.service';
import { CompanyService } from '../services/auth-company.service';
import { CustomerService } from '../services/auth-customer.service';

@Controller('auth')
export class AuthController {
  constructor(
    private companyService: CompanyService,
    private adminService: AdminService,
    private customerService: CustomerService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  getHello() {
    return { hello: 'Hello World' };
  }

  //COMPANY
  @Post('register/company')
  registerCompany(@Body() company: Company): Observable<CompanyEntity> {
    return this.companyService.register(company);
  }
  @Post('login/company')
  loginCompany(@Body() user: User): Observable<{ token: string }> {
    return this.companyService
      .login(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }

  //ADMIN
  @Post('register/admin')
  registerAdmin(@Body() admin: Admin): Observable<AdminEntity> {
    return this.adminService.registerAdmin(admin);
  }
  @Post('login/admin')
  loginAdmin(@Body() user: User): Observable<{ token: string }> {
    return this.adminService
      .loginAdmin(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }

  //ADMIN
  @Post('register/customer')
  registerCustomer(@Body() customer: Customer): Observable<AdminEntity> {
    return this.customerService.register(customer);
  }
  @Post('login/customer')
  loginCustomer(@Body() user: User): Observable<{ token: string }> {
    return this.customerService
      .login(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }
}
