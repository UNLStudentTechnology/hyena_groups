'use strict';

/**
 * @ngdoc function
 * @name hyenaGroupsApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the hyenaGroupsApp
 */
angular.module('hyenaGroupsApp')
  .controller('SettingsCtrl', function ($scope, $rootScope, $stateParams, GroupService) {
    //Get the requested group by ID
    var groupId = $rootScope.currentGroupId = parseInt($stateParams.groupId);
    GroupService.get(groupId, 'users').then(function(response) {
		$scope.group = response.data;
		$scope.members = response.data.users;
    });
  });
