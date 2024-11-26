import { LOGIN_ENDPOINT, REGISTRATION_ENDPOINT } from '@common/constants';
import { ResponseManager } from '@common/helpers';
import { ERROR_MESSAGES } from '@common/messages';
import { IAuthToken, ICreateUser } from '@common/models';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DataFetchService {
  constructor(private readonly _httpService: HttpService) {}

  async create(body: ICreateUser): Promise<IAuthToken> {
    try {
      const response = await firstValueFrom(
        this._httpService.post(REGISTRATION_ENDPOINT, body),
      );

      return response.data;
    } catch (error) {
      throw ResponseManager.buildError(
        ERROR_MESSAGES.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(body: ICreateUser): Promise<IAuthToken> {
    try {
      const response = await firstValueFrom(
        this._httpService.post(LOGIN_ENDPOINT, body),
      );

      return response.data;
    } catch (error) {
      throw ResponseManager.buildError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
