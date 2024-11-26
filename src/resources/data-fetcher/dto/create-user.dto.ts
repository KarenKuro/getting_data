import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @Transform(({ value }) => {
    return value?.trim();
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
