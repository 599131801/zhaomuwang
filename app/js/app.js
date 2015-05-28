'use strict';

/* App Module */

var app = angular.module('zhaomuwang', [
  'ngRoute',
  'ngResource',
  // 'ui.bootstrap',
  'routeStyles',
  'angular-oauth2',
  'Controllers',
  'Factory'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home',{
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl',
        css:'css/home.css'
      }).
      when('/api',{
        templateUrl: 'partials/api.html',
        controller: 'ApiCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        css:'css/login.css'
      }).
      when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterCtrl',
        css:'css/register.css'
      }).
      when('/mall', {
        templateUrl: 'partials/mall.html',
        css:'css/mall.css'
      }).
      when('/me/info', {
        templateUrl: 'partials/me/account_info.html',
        css:'css/me/info.css'
      }).
      when('/me/security', {
        templateUrl: 'partials/me/account_security.html',
        css: 'css/me/security.css'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }
]);
var config = {
      baseUrl: 'http://192.168.137.1:8080/zhaomuwang',
      clientId: '7b5a38705d7b3562655925406a652e32',
      clientSecret: '655f523128212d6e70634446224c2a48',
      grantPath: '/oauth/token',
      revokePath: '/oauth/revoke',
      usersPath:'/api/users',
      woodsPath:'/api/woods'
    };
app.config(['OAuthProvider', function(OAuthProvider) {
    OAuthProvider.configure(config);
  }]);

app.run(['$rootScope', '$window', 'OAuth','OAuthToken', function($rootScope, $window, OAuth,OAuthToken) {
    // console.log(OAuthToken);
    $rootScope.OAuth = {};
    $rootScope.OAuth.isAuthenticated = OAuth.isAuthenticated();
    console.log('登录状态：'+$rootScope.OAuth.isAuthenticated);
    $rootScope.$on('oauth:error', function(event, rejection) {
      $rootScope.OAuth.isAuthenticated = OAuth.isAuthenticated();
      // Ignore `invalid_grant` error - should be catched on `LoginController`.
      if ('invalid_grant' === rejection.data.error) {
        return;
      }

      // Refresh token when a `invalid_token` error occurs.
      if ('invalid_token' === rejection.data.error) {
        return OAuth.getRefreshToken();
      }

      // Redirect to `/login` with the `error_reason`.
      // return $window.location.href = '#/login?error_reason=' + rejection.data.error;
    });
    $rootScope.$on('oauth:success', function(event, rejection) {
      $rootScope.OAuth.isAuthenticated = OAuth.isAuthenticated();
      return $window.location.href = '#/home';
    });
  }]);

// app.factory('Users', ['$http','$resource', function($http,$resource){
//   var Users = $resource(config.baseUrl+''+config.usersPath+'/:id', {id:'@_id.$oid'}, {
//     update: {method:'PUT',isArray:false}
//   });
//   return Users;
// }]);