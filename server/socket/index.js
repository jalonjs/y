module.exports = function (server) {
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        socket.emit('start', {msg: '已经建立连接!'});
        socket.on('myEvent', function (data) {
            console.log(data);
        });
    });

};
