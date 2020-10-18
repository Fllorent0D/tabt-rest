import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestBySeason {
  @ApiPropertyOptional()
  @Transform(id => parseInt(id), {toClassOnly: true})
  @IsInt()
  @IsOptional()
  season?: number;
}
