'use strict';

angular.module('h5editorMis', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ui.router',
        'ngSanitize',
        'ngTouch'
    ])
    .config(['$locationProvider', '$urlMatcherFactoryProvider',
        function ($locationProvider, $urlMatcherFactoryProvider) {
            $urlMatcherFactoryProvider.strictMode(false);
            $locationProvider.html5Mode(true);
        }]).run(function () {


});
