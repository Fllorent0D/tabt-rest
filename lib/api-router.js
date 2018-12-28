const express = require('express');
const router = express.Router();

const commonResponse = require('./helpers/common-response');

const routes = [
    {
        route: '/test',
        method: 'GET',
        handle: {
            operation: 'Test',
            args: [],
            entityCountKey: null,
            entitiesKey: null,
            cacheDuration: 0,
            returnUniqueValue: null,
            needCredentials: true
        }
    },
    {
        route: '/clubs/:club?',
        method: 'GET',
        handle: {
            operation: 'GetClubs',
            args: ['clubCategory', 'season', 'club'],
            entityCountKey: 'ClubCount',
            entitiesKey: 'ClubEntries',
            cacheDuration: 86400,
            returnUniqueValue: 'Club',
            needCredentials: true
        }
    },
    {
        route: '/clubs/:club/teams',
        method: 'GET',
        handle: {
            operation: 'GetClubTeams',
            args: ['season', 'club'],
            entityCountKey: 'TeamCount',
            entitiesKey: 'TeamEntries',
            cacheDuration: 86400,
            returnUniqueValue: null,
            needCredentials: true
        }
    },
    {
        route: '/clubs/:club/membres',
        method: 'GET',
        handle: {
            operation: 'GetMembers',
            args: [
                'club',
                'season',
                'extendedInformation',
                'rankingPointsInformation',
                'withResults',
                'withOpponentRankingEvaluation'
            ],
            entityCountKey: 'MemberCount',
            entitiesKey: 'MemberEntries',
            cacheDuration: 86400,
            returnUniqueValue: null,
            needCredentials: true
        }
    },
    {
        route: '/tournaments/:tournamentUniqueIndex?',
        method: 'GET',
        handle: {
            operation: 'GetTournaments',
            args: ['season', 'tournamentUniqueIndex', 'withResults'],
            entityCountKey: null,
            entitiesKey: null,
            cacheDuration: 3600,
            returnUniqueValue: 'TournamentUniqueIndex',
            needCredentials: true
        }
    },
    {
        route: '/tournaments/:tournamentUniqueIndex/register',
        method: 'POST',
        handle: {
            operation: 'TournamentRegister',
            args: [
                'season',
                'tournamentUniqueIndex',
                'serieUniqueIndex',
                'playerUniqueIndex',
                'notifyPlayer',
                'unregister'
            ],
            entityCountKey: null,
            entitiesKey: null,
            cacheDuration: 0,
            returnUniqueValue: null,
            needCredentials: true
        }
    },
    {
        route: '/seasons',
        method: 'GET',
        handle: {
            operation: 'GetSeasons',
            args: [],
            entityCountKey: null,
            entitiesKey: null,
            cacheDuration: 432000,
            returnUniqueValue: null,
            needCredentials: false
        }
    },
    {
        route: '/divisions',
        method: 'GET',
        handle:  {
            operation: 'GetDivisions',
            args: ['season', 'level', 'showDivisionName'],
            entityCountKey: 'DivisionCount',
            entitiesKey: 'DivisionEntries',
            cacheDuration: 86400,
            returnUniqueValue: 'null',
            needCredentials: true
        }
    },
    {
        route: '/divisions/:divisionId/ranking',
        method: 'GET',
        handle: {
            operation: 'GetDivisionRanking',
            args: ['divisionId', 'weekName', 'rankingSystem'],
            entityCountKey: null,
            entitiesKey: null,
            cacheDuration: 3600,
            returnUniqueValue: null,
            needCredentials: true
        }
    },
    {
        route: '/matchs',
        method: 'GET',
        handle: {
            operation: 'GetMatches',
            args: [
                'divisionId',
                'club',
                'team',
                'divisionCategory',
                'season',
                'weekName',
                'level',
                'showDivisionName',
                'yearDateFrom',
                'yearDateTo',
                'withDetails',
                'matchId',
                'matchUniqueId'
            ],
            entityCountKey: 'MatchCount',
            entitiesKey: 'TeamMatchesEntries',
            cacheDuration: 3600,
            returnUniqueValue: null,
            needCredentials: false
        }
    },
    {
        route: '/matchs/systems/:UniqueIndex?',
        method: 'GET',
        handle: {
            operation: 'GetMatchSystems',
            args: ['UniqueIndex'],
            entityCountKey: 'MatchSystemCount',
            entitiesKey: 'MatchSystemEntries',
            cacheDuration: 3600*24*30,
            returnUniqueValue: 'UniqueIndex',
            needCredentials: false
        }
    },
    {
        route: '/membres/:uniqueIndex?',
        method: 'GET',
        handle: {
            operation: 'GetMembers',
            args: [
                'club',
                'season',
                'playerCategory',
                'nameSearch',
                'uniqueIndex',
                'extendedInformation',
                'rankingPointsInformation',
                'withResults',
                'withOpponentRankingEvaluation'
            ],
            entityCountKey: 'MemberCount',
            entitiesKey: 'MemberEntries',
            cacheDuration: 3600*24,
            returnUniqueValue: 'UniqueIndex',
            needCredentials: true
        }
    },
];

routes.forEach((route) => {
    router[route.method.toString().toLowerCase()](route.route, (req, res) => commonResponse.handleRequestWithCache(req, res, route.handle))
});

module.exports = router;
