import { ApiProperty } from '@nestjs/swagger';

export class SuccessDTO {
  @ApiProperty({ type: Boolean })
  success: boolean;
}
