angular.module('h5editorMis').factory('socket', function () {
    var socket = io();
    return socket;
});