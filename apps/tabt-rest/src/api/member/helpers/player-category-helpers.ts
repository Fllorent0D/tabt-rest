import { PlayerCategoryDTO } from 'apps/tabt-rest/src/common/dto/player-category.dto';
import { PLAYER_CATEGORY_OLD } from '../dto/member.dto';

export const getSimplifiedPlayerCategory = (
  category: PLAYER_CATEGORY_OLD,
): PlayerCategoryDTO => {
  switch (category) {
    case PLAYER_CATEGORY_OLD.MEN:
    case PLAYER_CATEGORY_OLD.YOUTH:
    case PLAYER_CATEGORY_OLD.VETERANS:
    default:
      return PlayerCategoryDTO.SENIOR_MEN;
    case PLAYER_CATEGORY_OLD.WOMEN:
    case PLAYER_CATEGORY_OLD.VETERANS_WOMEN:
      return PlayerCategoryDTO.SENIOR_WOMEN;
  }
};
