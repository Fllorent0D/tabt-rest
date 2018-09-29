const express = require('express');
const router = express.Router();

const commonResponse = require('../helpers/common-response');

router.get('/:uniqueIndex?', (req, res) => {
    commonResponse.handleRequestWithCache(req, res, {
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
    });
});


module.exports = router;
