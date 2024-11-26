import {
  FETCH_DATA_ENDPOINT,
  LOGIN_ENDPOINT,
  REGISTRATION_ENDPOINT,
} from '@common/constants';
import { ResponseManager } from '@common/helpers';
import { ERROR_MESSAGES } from '@common/messages';
import {
  IAuthToken,
  IClient,
  IClientWithoutStatus,
  ICreateUser,
  IPagination,
  IStatuses,
} from '@common/models';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GoogleSheetsService } from './google.sheets.service';

@Injectable()
export class DataFetchService {
  constructor(
    private readonly _httpService: HttpService,
    private readonly _googleSheetsService: GoogleSheetsService,
  ) {}

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

  async fetchData(
    tokenobj: IAuthToken,
    pagination: IPagination,
  ): Promise<IClientWithoutStatus[]> {
    try {
      const token_str = tokenobj.token;

      const headers = { Authorization: token_str };
      const params = {
        limit: +pagination.limit,
        offset: +pagination.offset,
      };

      const response = await firstValueFrom(
        this._httpService.get(FETCH_DATA_ENDPOINT, { headers, params }),
      );

      return response.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw ResponseManager.buildError(
        ERROR_MESSAGES.USER_NOT_AUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async createTable(
    clientsWithoutStatus: IClientWithoutStatus[],
    tokenobj: IAuthToken,
  ): Promise<void> {
    const clientsIds = { userIds: clientsWithoutStatus.map((el) => el.id) };

    try {
      const token_str = tokenobj.token;

      const headers = { Authorization: token_str };

      const response = await firstValueFrom(
        this._httpService.post(
          FETCH_DATA_ENDPOINT,
          { userIds: clientsIds.userIds },
          { headers },
        ),
      );

      const statuses = response.data as IStatuses[];

      const clientsData: IClient[] = clientsWithoutStatus.map((el) => {
        const statusEl = statuses.find((item) => item.id === el.id);

        return { ...el, ...statusEl };
      });

      await this._googleSheetsService.writeDataToSheet(clientsData);

    } catch (error) {
      console.error(error.response?.data || error.message);
      throw ResponseManager.buildError(
        ERROR_MESSAGES.USER_NOT_AUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
