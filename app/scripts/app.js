'use strict';

/**
 * @ngdoc overview
 * @name hyenaGroupsApp
 * @description
 * # hyenaGroupsApp
 *
 * Main module of the application.
 */
angular
  .module('hyenaGroupsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'angularMoment',
    'hyenaAngular',
    'ngTagsInput',
    'ngCsv'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/group/new', {
        templateUrl: 'views/new.html',
        controller: 'NewCtrl'
      })
      .when('/group/:groupId', {
        templateUrl: 'views/group.html',
        controller: 'GroupCtrl'
      })
      .when('/group/:groupId/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(true);
  })
  .config(function ($httpProvider) {
    //$httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  })
  .constant('FBURL', 'https://hyena-groups.firebaseio.com/')
  .constant('APIKEY', 'MGE0OWQ2ZjUwMDc4YjU0MzdkNTBiNzA4')
  .constant('APIPATH', 'http://st-studio.unl.edu/hyena_platform/public/api/1.0/')
  .constant('PLATFORM_ROOT', 'http://st-studio.unl.edu/hyena_platform/public/')
  .constant('AUTH_SCOPE', 'groups');
