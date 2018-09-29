const express = require('express');
const router = express.Router();
const _ = require('lodash');

const request = require('../frenoy/soap-request');
const commonResponse = require('../helpers/common-response');
const commonParams = require('../helpers/common-params');
const {getResponseFromCache, setInCache} = require('../helpers/cache');

router.get('/', (req, res) => {
    commonResponse.handleRequestWithCache(req, res, {
        operation: 'GetDivisions',
        args: ['season', 'level', 'showDivisionName'],
        entityCountKey: 'DivisionCount',
        entitiesKey: 'DivisionEntries',
        cacheDuration: 3600*60,
        returnUniqueValue: 'null',
        needCredentials: true
    });
});

router.get('/:divisionId/ranking', (req, res) => {
    commonResponse.handleRequestWithCache(req, res, {
        operation: 'GetDivisionRanking',
        args: ['divisionId', 'weekName', 'rankingSystem'],
        entityCountKey: null,
        entitiesKey: null,
        cacheDuration: 3600,
        returnUniqueValue: null,
        needCredentials: true
    });
});

module.exports = router;
