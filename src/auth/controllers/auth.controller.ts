import { UpdateDeleteReturnObject } from './../models/update-return.object';
import { LoginReturnObject } from '../models/login-return.object';
import { JwtGuard } from './../guards/jwt.guard';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Admin } from '../models/dto/admin.dto';
import { Company } from '../models/dto/company.dto';
import { Customer } from '../models/dto/customer.dto';
import { User } from '../models/dto/user.dto';
import { AdminEntity } from '../models/entities/admin.entity';
import { CompanyEntity } from '../models/entities/company.entity';
import { CustomerEntity } from '../models/entities/customer.entity';
import { AdminService } from '../services/auth-admin.service';
import { CompanyService } from '../services/auth-company.service';
import { CustomerService } from '../services/auth-customer.service';
import { IsAdminGuard } from '../guards/is-admin.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller()
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private companyService: CompanyService,
    private adminService: AdminService,
    private customerService: CustomerService,
  ) {}

  //ADMIN
  @ApiOperation({ summary: 'Register an admin.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiCreatedResponse({ type: AdminEntity })
  @Post('register/admin')
  registerAdmin(@Body() admin: Admin): Observable<AdminEntity> {
    return this.adminService.registerAdmin(admin);
  }

  @ApiOperation({ summary: 'Admin login.' })
  @ApiNotFoundResponse({ description: 'Invalid credentials' })
  @ApiCreatedResponse({ type: LoginReturnObject })
  @Post('login/admin')
  loginAdmin(@Body() user: User): Observable<{ token: string }> {
    return this.adminService
      .loginAdmin(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }

  //CUSTOMER
  @ApiOperation({ summary: 'Register a customer.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiCreatedResponse({ type: CustomerEntity })
  @Post('register/customer')
  registerCustomer(@Body() customer: Customer): Observable<CustomerEntity> {
    return this.customerService.register(customer);
  }

  @ApiOperation({ summary: 'Customer login.' })
  @ApiNotFoundResponse({ description: 'Invalid credentials' })
  @ApiCreatedResponse({ type: LoginReturnObject })
  @Post('login/customer')
  loginCustomer(@Body() user: User): Observable<{ token: string }> {
    return this.customerService
      .login(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }

  //COMPANY
  @ApiOperation({ summary: 'Register a company.' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiCreatedResponse({ type: CompanyEntity })
  @Post('register/company')
  registerCompany(@Body() company: Company): Observable<CompanyEntity> {
    return this.companyService.register(company);
  }

  @ApiOperation({ summary: 'Company login.' })
  @ApiNotFoundResponse({ description: 'Invalid credentials' })
  @ApiCreatedResponse({ type: LoginReturnObject })
  @Post('login/company')
  loginCompany(@Body() user: User): Observable<{ token: string }> {
    return this.companyService
      .login(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }

  @ApiOperation({ summary: 'Disable company.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOkResponse({ type: UpdateDeleteReturnObject })
  @UseGuards(JwtGuard, IsAdminGuard)
  @Patch('disable/:id')
  disableCompany(@Param('id') companyId: number) {
    return this.companyService.enableDisable(companyId, false);
  }

  @ApiOperation({ summary: 'Enable company.' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOkResponse({ type: UpdateDeleteReturnObject })
  @UseGuards(JwtGuard, IsAdminGuard)
  @Patch('enable/:id')
  enableCompany(@Param('id') companyId: number) {
    return this.companyService.enableDisable(companyId, true);
  }
}
