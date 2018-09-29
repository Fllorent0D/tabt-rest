const express = require('express');
const router = express.Router();

const commonResponse = require('../helpers/common-response');

router.get('/', (req, res) => {
    commonResponse.handleRequestWithCache(req, res, {
        operation: 'GetSeasons',
        args: [],
        entityCountKey: null,
        entitiesKey: null,
        cacheDuration: 3600*60,
        returnUniqueValue: null,
        needCredentials: false
    });
});

module.exports = router;
