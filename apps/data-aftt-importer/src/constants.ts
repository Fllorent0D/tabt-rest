import { PlayerCategory } from '@prisma/client';

export const playerCategoryFilenameMapping: { [index: string]: string } = {
  [PlayerCategory.MEN]: 'liste_result_1.txt',
  [PlayerCategory.WOMEN]: 'liste_result_2.txt',
};
