import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DataFetchService } from './data-fetcher.service';
import { AuthTokenDTO, CreateUserDTO, SuccessDTO } from './dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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

}
