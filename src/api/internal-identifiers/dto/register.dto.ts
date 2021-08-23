import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UniqueIdentifiersDTO {
  @IsString()
  @ApiProperty()
  clubUniqueIndex: string;

  @IsNumber()
  @ApiProperty()
  @Transform((a) => Number(a))
  playerUniqueIndex: number;
}

export class InternalIdentifiersDTO {
  @ApiProperty()
  @IsNumber()
  clubInternalIdentifier: number;

  @ApiProperty()
  @IsNumber()
  playerInternalIdentifier: number;
}

export class RedirectLinkDTO {
  @ApiProperty()
  @IsString()
  url: string;

}

