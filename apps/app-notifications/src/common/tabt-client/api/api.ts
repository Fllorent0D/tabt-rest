export * from './clubs.service';
import { ClubsService } from './clubs.service';
import { DashboardsService } from './dashboards.service';
import { DefaultService } from './default.service';
import { DivisionsService } from './divisions.service';
import { Head2HeadService } from './head2Head.service';
import { HealthService } from './health.service';
import { InternalIdentifiersService } from './internalIdentifiers.service';
import { MatchesService } from './matches.service';
import { MembersService } from './members.service';
import { SeasonsService } from './seasons.service';
import { TournamentsService } from './tournaments.service';

export * from './dashboards.service';
export * from './default.service';
export * from './divisions.service';
export * from './head2Head.service';
export * from './health.service';
export * from './internalIdentifiers.service';
export * from './matches.service';
export * from './members.service';
export * from './seasons.service';
export * from './tournaments.service';
export const APIS = [
  ClubsService,
  DashboardsService,
  DefaultService,
  DivisionsService,
  Head2HeadService,
  HealthService,
  InternalIdentifiersService,
  MatchesService,
  MembersService,
  SeasonsService,
  TournamentsService,
];
