import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class AuthTokenDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
