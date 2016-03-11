var path = require('path');
var config = require('./config/config');

module.exports = function (app) {

    // 其余API请求，走代理
    app.use('/api', require('./api'));

    // All other routes should redirect to the index.html
    app.route('/*').get(function (req, res) {
        res.render('index');
    });

    function checkToken(req, res) {

    }

    function sha1(data) {
        var Buffer = require("buffer").Buffer;
        var buf = new Buffer(data);
        var str = buf.toString("binary");
        var crypto = require("crypto");
        return crypto.createHash("sha1").update(str).digest("hex");
    }
};
