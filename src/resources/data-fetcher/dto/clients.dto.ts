import { ApiProperty } from '@nestjs/swagger';

export class ClientsWithoutStatusDTO {
  @ApiProperty({ type: String })
  id: number;

  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  lastName: string;

  @ApiProperty({ type: String })
  gender: string;

  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: String })
  city: string;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String })
  email: string;
}
