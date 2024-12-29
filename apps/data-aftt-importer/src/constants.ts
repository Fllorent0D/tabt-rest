import { PlayerCategory } from '@prisma/client';
export const playerCategoryFilenameMapping: { [index: string]: string } = {
  [PlayerCategory.SENIOR_MEN]: 'liste_result_1.txt',
  [PlayerCategory.SENIOR_WOMEN]: 'liste_result_2.txt',
};
