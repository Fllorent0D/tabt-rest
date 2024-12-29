import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  DivisionEntry,
  GetDivisionsInput,
} from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';
import { GetDivisionsV2 } from '../../api/divisions/dto/divisions.dto';
import { LevelDTO, mapLevelDTOToLevels } from '../../common/dto/levels.dto';
import { divisionCategoryDTOToDivisionCategory } from '../../common/dto/division-category.dto';

@Injectable()
export class DivisionService {
  private readonly logger = new Logger('DivisionsService');

  constructor(private tabtClient: TabtClientService) {}

  async getDivisions(input: GetDivisionsInput): Promise<DivisionEntry[]> {
    const result = await this.tabtClient.GetDivisionsAsync(input);
    return result.DivisionEntries;
  }

  async getDivisionsV2(query: GetDivisionsV2): Promise<DivisionEntry[]> {
    const input: GetDivisionsInput = {
      Level: query.level ? mapLevelDTOToLevels(query.level as LevelDTO)[0] : undefined,
      ShowDivisionName: query.showDivisionName,
    }
    const result = await this.tabtClient.GetDivisionsAsync(input);
    return result.DivisionEntries.filter(division => {
      if (query.divisionCategory) {
        return division.DivisionCategory === divisionCategoryDTOToDivisionCategory[query.divisionCategory];
      }
      return true;
    });
  }

async getDivisionByIdV2(id: number): Promise<DivisionEntry> {
  const division = await this.getDivisionsById(id, {
    ShowDivisionName: 'yes',
  });
  if (!division) {
    throw new NotFoundException();
  }
  return division;
}

  async getDivisionsById(
    id: number,
    input: GetDivisionsInput,
  ): Promise<DivisionEntry> {
    const divisions = await this.getDivisions(input);
    return divisions.find((division) => division.DivisionId === id);
  }


}
