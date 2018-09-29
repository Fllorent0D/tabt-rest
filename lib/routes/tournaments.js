const express = require('express');
const router = express.Router();
const _ = require('lodash');

const request = require('../frenoy/soap-request');
const commonResponse = require('../helpers/common-response');
const commonParams = require('../helpers/common-params');

router.get('/:tournamentUniqueIndex?', (req, res) => {
    commonResponse.handleRequestWithCache(req, res, {
        operation: 'GetTournaments',
        args: ['season', 'tournamentUniqueIndex'],
        entityCountKey: 'TournamentCount',
        entitiesKey: 'TournamentEntries',
        cacheDuration: 3600,
        returnUniqueValue: 'TournamentUniqueIndex',
        needCredentials: true
    });
});

router.post('/:tournamentUniqueIndex/register', (req, res) => {
    const params = [
        'season',
        'tournamentUniqueIndex',
        'serieUniqueIndex',
        'playerUniqueIndex',
        'notifyPlayer',
        'unregister'
    ];
    const args = commonParams(req, params);

    request('GetTournaments', args)
        .then((result) => {
            _.get(result, 'TournamentCount') === 0 ?
                commonResponse.noData(res, result) :
                _.has(args, 'TournamentUniqueIndex') ?
                    commonResponse.sendData(res, _.get(result, 'TournamentEntries[0]')) :
                    commonResponse.sendData(res, _.get(result, 'TournamentEntries'));
        })
        .catch((err) => {
            commonResponse.handleError(res, err);
        })
});



module.exports = router;
