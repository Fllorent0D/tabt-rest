import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { PLAYER_CATEGORY } from '../dto/member.dto';

export type SimplifiedPlayerCategory = PlayerCategory.MEN | PlayerCategory.WOMEN
export const getSimplifiedPlayerCategory = (category: PLAYER_CATEGORY): SimplifiedPlayerCategory => {
  switch (category) {
    case PLAYER_CATEGORY.MEN:
    case PLAYER_CATEGORY.YOUTH:
    case PLAYER_CATEGORY.VETERANS:
    default:
      return PlayerCategory.MEN;
    case PLAYER_CATEGORY.WOMEN:
    case PLAYER_CATEGORY.VETERANS_WOMEN:
      return PlayerCategory.WOMEN;
  }
};
