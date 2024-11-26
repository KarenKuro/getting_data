import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthTokenDTO } from 'src/resources/data-fetcher/dto';

export const AuthToken = createParamDecorator(
  (_: string, ctx: ExecutionContext): AuthTokenDTO => {
    const request = ctx.switchToHttp().getRequest();
    const tokenString = request.headers.authorization;

    if (!tokenString || !tokenString.startsWith('Bearer ')) {
      throw new Error('Invalid token format');
    }

    const token = tokenString.replace('Bearer ', '');

    const tokenDTO: AuthTokenDTO = { token };

    return tokenDTO;
  },
);
