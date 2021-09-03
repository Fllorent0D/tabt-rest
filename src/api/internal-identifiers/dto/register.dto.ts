import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TABT_DATABASE } from '../../../common/context/database-context.service';

export class UniqueIdentifiersDTO {
  @IsString()
  @ApiProperty()
  clubUniqueIndex: string;

  @IsString()
  @ApiProperty()
  @IsEnum(TABT_DATABASE)
  database: TABT_DATABASE;

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

