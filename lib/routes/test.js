const express = require('express');
const router = express.Router();

const request = require('../frenoy/soap-request');
const commonResponse = require('../helpers/common-response');

router.get('/', (req, res) => {
    request('Test', {}).then((result) => {
        res.json(result);
    }).catch((err) => {
        commonResponse.handleError(res, err);
    })
});

module.exports = router;
