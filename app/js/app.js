'use strict';

/* App Module */

var app = angular.module('zhaomuwang', [
  'ngRoute',
  'Controllers'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home',{
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
