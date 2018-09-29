const express = require('express');
const router = express.Router();
const commonResponse = require('../helpers/common-response');

router.get('/:club?', (req, res) => {
    commonResponse.handleRequestWithCache(req, res, {
        operation: 'GetClubs',
        args: ['clubCategory', 'season', 'club'],
        entityCountKey: 'ClubCount',
        entitiesKey: 'ClubEntries',
        cacheDuration: 3600,
        returnUniqueValue: 'Club',
        needCredentials: true
    });
});

router.get('/:club/teams', (req, res) => {
    commonResponse.handleRequestWithCache(req, res, {
        operation: 'GetClubTeams',
        args: ['season', 'club'],
        entityCountKey: 'TeamCount',
        entitiesKey: 'TeamEntries',
        cacheDuration: 3600,
        returnUniqueValue: null,
        needCredentials: true
    });
});

router.get('/:club/membres', (req, res) => {
    commonResponse.handleRequestWithCache(req, res, {
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
        cacheDuration: 3600,
        returnUniqueValue: null,
        needCredentials: true
    });
});

module.exports = router;
