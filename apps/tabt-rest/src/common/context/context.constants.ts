export abstract class HeaderKeys {
  static readonly X_TABT_ACCOUNT = 'X-Tabt-Account';
  static readonly X_TABT_PASSWORD = 'X-Tabt-Password';
  static readonly X_TABT_ONBEHALFOF = 'X-Tabt-OnBehalfOf';
  static readonly X_TABT_DATABASE = 'X-Tabt-Database';
  static readonly X_TABT_SEASON = 'X-Tabt-Season';
  static readonly X_FORWARDED_FOR = 'X-Forwarded-For';
  static readonly X_APPLICATION_FOR = 'X-Application-For';
}

export const TABT_HEADERS = [
  HeaderKeys.X_TABT_ACCOUNT,
  HeaderKeys.X_TABT_PASSWORD,
  HeaderKeys.X_TABT_ONBEHALFOF,
  HeaderKeys.X_TABT_DATABASE,
  HeaderKeys.X_FORWARDED_FOR,
  HeaderKeys.X_TABT_SEASON,
  HeaderKeys.X_APPLICATION_FOR,
];
