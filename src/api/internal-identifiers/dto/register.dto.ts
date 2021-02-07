import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UniqueIdentifiers {
  @IsString()
  @ApiProperty()
  clubUniqueIndex: string;

  @IsNumber()
  @ApiProperty()
  @Transform((a) => Number(a))
  playerUniqueIndex: number;
}

export class InternalIdentifiers {
  @ApiProperty()
  @IsNumber()
  clubInternalIdentifier: number;

  @ApiProperty()
  @IsNumber()
  playerInternalIdentifier: number;
}
