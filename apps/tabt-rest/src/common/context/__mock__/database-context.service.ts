import { TABT_DATABASE } from '../database-context.service';

export class DatabaseContextService {
  get database(): string {
    return TABT_DATABASE.AFTT;
  }
}
