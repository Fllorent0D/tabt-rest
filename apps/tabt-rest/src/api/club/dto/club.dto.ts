import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { GetMembers } from '../../member/dto/member.dto';
import { ClubCategory } from '../../../entity/tabt-input.interface';
import { IsOptional, IsString } from 'class-validator';

export class ListAllClubs {
  @ApiPropertyOptional({ enum: ClubCategory })
  @IsOptional()
  @IsString()
  clubCategory: string;
}

export class GetMembersFromClub extends OmitType(GetMembers, ['club'] as const) {
}
