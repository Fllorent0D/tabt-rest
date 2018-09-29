const express = require('express');
const router = express.Router();
const _ = require('lodash');

const request = require('../frenoy/soap-request');
const commonResponse = require('../helpers/common-response');
const commonParams = require('../helpers/common-params');

router.get('/', (req, res) => {
    commonResponse.handleRequestWithCache(req, res, {
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
    });
});

router.get('/systems/:UniqueIndex?', (req, res) => {
    commonResponse.handleRequestWithCache(req, res, {
        operation: 'GetMatchSystems',
        args: ['UniqueIndex'],
        entityCountKey: 'MatchSystemCount',
        entitiesKey: 'MatchSystemEntries',
        cacheDuration: 3600*24*30,
        returnUniqueValue: 'UniqueIndex',
        needCredentials: false
    });
});

module.exports = router;
