export interface TabtInputInterface {
  toTabtInput(): any;
}
export enum Level {
  NATIONAL = 1,
  HAINAUT = 4,
  VLAAMS_BRABANT_BR = 5,
  SUPER_DIVISION = 6,
  OOST_VLANDEREN = 7,
  ANTWERP = 8,
  WEST_VLAANDEREN = 9,
  LIMBURG = 10,
  BRUSSELS_BRABANT_WALLON = 11,
  NAMUR = 12,
  LIEGE = 13,
  LUXEMBOURG = 14,
  REGION_VTTL = 15,
  IWB = 16,
}

export enum MemberStatus {
  ACTIVE = 'A',
  ADMINISTRATIVE = 'M',
  NON_ACTIVE = 'I',
  RECREANT = 'R',
  RECREANT_RESERVE = 'V',
  DOUBLE_AFFILIATION = 'D',
  DOUBLE_AFFILIATION_SUPER = 'T',
  SUPER_DIVISION = 'S',
  LICENCE_A = 'C',
  INDIVIDUAL_PLAYER = 'N',
  EXTERN = 'E',
}

// OUTDATED
// TO REFACTOR
export enum PlayerCategory {
  MEN = 1,
  WOMEN = 2,
  VETERANS = 3,
  VETERANS_WOMEN = 4,
  YOUTH = 5,
  MEN_POST_23 = 37,
  WOMEN_POST_23 = 38,
  YOUTH_POST_23 = 41,
}

export enum ClubCategory {
  VLAAMS_BRABANT_BR = 2,
  BRUSSELS_BRABANT_WALLON = 3,
  ANTWERP = 4,
  OOST_VLANDEREN = 5,
  WEST_VLAANDEREN = 6,
  LIMBURG = 7,
  HAINAUT = 8,
  LUXEMBOURG = 9,
  LIEGE = 10,
  NAMUR = 11,
  VTTL = 12,
  AFTT = 13,
  FRBTT = 14,
}
