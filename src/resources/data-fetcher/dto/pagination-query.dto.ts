import { ApiProperty } from '@nestjs/swagger';

import { IsNumberString } from 'class-validator';

export class PaginationQueryDTO {
  @ApiProperty()
  @IsNumberString()
  limit = '100';

  @ApiProperty()
  @IsNumberString()
  offset = '0';
}
