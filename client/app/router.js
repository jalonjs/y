'use strict';

angular.module('h5editorMis')
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('feed', {
                    url: '/feed',
                    templateUrl: 'app/feed/feed.html',
                    controller: 'FeedCtrl'
                })
                .state('feed.aaa', {
                    url: '/aaa',
                    templateUrl: 'app/feed/aaa/aaa.html',
                }).state('feed.bbb', {
                    url: '/bbb',
                    templateUrl: 'app/feed/bbb/bbb.html',
                });
            $urlRouterProvider.otherwise("/feed");
        }]);
