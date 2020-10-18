import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, isEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { GetMembersInput, Player } from '../../../entity/tabt-soap/TabTAPI_Port';
import { RequestBySeason } from '../../../common/dto/RequestBySeason';
import { PlayerCategory, TabtInputInterface } from '../../../entity/tabt-input.interface';

export class GetMembers extends RequestBySeason implements TabtInputInterface {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  club?: string;

  @ApiPropertyOptional({enum: PlayerCategory})
  @IsOptional()
  @IsEnum(PlayerCategory)
  playerCategory: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(id => parseInt(id), { toClassOnly: true })
  uniqueIndex?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nameSearch?: string;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a))
  @IsBoolean()
  @IsOptional()
  extendedInformation?: boolean;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a))
  @IsBoolean()
  @IsOptional()
  rankingPointsInformation?: boolean;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a))
  @IsBoolean()
  @IsOptional()
  withResults?: boolean;

  @ApiPropertyOptional()
  @Transform((a) => Boolean(a))
  @IsBoolean()
  @IsOptional()
  withOpponentRankingEvaluation?: boolean;

  toTabtInput(): GetMembersInput {
    return {
      Club: this.club,
      Season: this.season,
      // PlayerCategory: this.playerCategory,
      UniqueIndex: this.uniqueIndex,
      NameSearch: this.nameSearch,
      ExtendedInformation: this.extendedInformation,
      RankingPointsInformation: this.rankingPointsInformation,
      WithResults: this.withResults,
      WithOpponentRankingEvaluation: this.withOpponentRankingEvaluation,
    };
  }

}

export class GetMember extends OmitType(GetMembers, ['uniqueIndex']) {
}
