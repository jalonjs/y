angular.module('yApp').factory('socket', function () {
    var socket = io();
    return socket;
});