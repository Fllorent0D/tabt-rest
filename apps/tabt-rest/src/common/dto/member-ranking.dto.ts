import { ApiProperty } from '@nestjs/swagger';

export class MemberResults {
  @ApiProperty()
  played: number;
  @ApiProperty()
  win: number;
  @ApiProperty()
  lose: number;
  @ApiProperty()
  uniqueIndex: number;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  ranking: string;
  @ApiProperty()
  winPourcentage: number;
  @ApiProperty()
  losePourcentage: number;
}
