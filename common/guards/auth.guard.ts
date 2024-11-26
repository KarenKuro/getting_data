import {
  ExecutionContext,
  CanActivate,
  Injectable,
  HttpStatus,
  mixin,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ResponseManager } from '@common/helpers';
import { ERROR_MESSAGES } from '@common/messages';
import { AuthTokenDTO } from 'src/resources/data-fetcher/dto';

export const AuthUserGuard = () => {
  @Injectable()
  class AuthUserGuard implements CanActivate {
    constructor(public readonly configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      const accessToken = (
        request.headers?.authorization ?? request.query?.authorization
      )
        ?.replace('Bearer', '')
        ?.trim() as string;

      if (!accessToken) {
        throw ResponseManager.buildError(
          ERROR_MESSAGES.USER_NOT_AUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      try {
        request.token = { token: accessToken } as AuthTokenDTO;
        return true;
      } catch (e) {
        throw ResponseManager.buildError(
          ERROR_MESSAGES.USER_NOT_AUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }

  const guard = mixin(AuthUserGuard);
  return guard;
};
