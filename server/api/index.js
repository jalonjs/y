var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.json({tip: '你想请求啥?'})
});

router.get('/name', function (req, res, next) {
    res.json({name: 'api'})
});


module.exports = router;
