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
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'angularMoment',
    'hyenaAngular',
    'ngTagsInput',
    'ngStorage',
    'ngCsv'
  ])
 .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      //Layouts
      .state('unl-layout', {
        templateUrl: 'views/layouts/unl-layout.html',
        data: {
          requireAuth: true
        }
      })
      .state('unl-layout-kiosk', {
        templateUrl: 'views/layouts/unl-layout-kiosk.html',
        data: {
          requireAuth: false
        }
      })
      //Views
      .state('unl-layout.main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('unl-layout.new', {
        url: '/group/new',
        templateUrl: 'views/new.html',
        controller: 'NewCtrl'
      })
      .state('unl-layout.group', {
        url: '/group/:groupId',
        templateUrl: 'views/group.html',
        controller: 'GroupCtrl'
      })
      .state('unl-layout.settings', {
        url: '/group/:groupId/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      });

      //Default Route
      $urlRouterProvider.otherwise("/");
      //End Default Route
      
      //Remove # from URLs
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
