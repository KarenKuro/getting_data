import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { DataFetchService } from './data-fetcher.service';
import {
  AuthTokenDTO,
  ClientsDTO,
  CreateUserDTO,
  PaginationQueryDTO,
} from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthToken } from '@common/decorators';
import { AuthUserGuard } from '@common/guards';

@Controller('api')
export class DataFetchController {
  constructor(private readonly _dataFetchService: DataFetchService) {}

  @ApiOperation({
    summary:
      'This API aimed  to register a user and receive a registration token',
  })
  @ApiResponse({
    status: 201,
    description: 'Return "token"',
    type: AuthTokenDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'User already exist',
    type: AuthTokenDTO,
  })
  @Post('create')
  async register(@Body() body: CreateUserDTO): Promise<AuthTokenDTO> {
    const token = await this._dataFetchService.create(body);
    return token;
  }

  @ApiOperation({
    summary: 'This API aimed to check the username and return "token"',
  })
  @ApiResponse({
    status: 201,
    description: 'Return "access tokens"',
    type: AuthTokenDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
    type: AuthTokenDTO,
  })
  @Post('login')
  async login(@Body() body: CreateUserDTO): Promise<AuthTokenDTO> {
    const token = await this._dataFetchService.login(body);
    return token;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of records to skip',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of records to return',
  })
  @ApiResponse({
    status: 200,
    type: Array<ClientsDTO>,
    description: 'Get clients list',
  })
  @Get('clients')
  @UseGuards(AuthUserGuard())
  async fetchData(
    @AuthToken() token: AuthTokenDTO,
    @Query() pagination: PaginationQueryDTO,
  ) {
    const data = await this._dataFetchService.fetchData(token, pagination);

    return data;
  }
}
