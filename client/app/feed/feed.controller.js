'use strict';

angular.module('yApp')
    .controller('FeedCtrl', ['$scope', 'socket', function ($scope, socket) {
        $scope.name = 'feed';

        socket.on('start', function () {
            socket.emit('myEvent', {data: 'I am jalon'});
        });
    }]);
