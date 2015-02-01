'use strict';

/**
 * @ngdoc function
 * @name hyenaGroupsApp.controller:NewCtrl
 * @description
 * # NewCtrl
 * Controller of the hyenaGroupsApp
 */
angular.module('hyenaGroupsApp')
  .controller('NewCtrl', function ($scope, Notification, GroupService) {
  	//Initialize a new group in scope
    $scope.group = {
    	title: '',
    	description: ''
    };

    /**
     * Creates a new group on the platform.
     */
    $scope.createGroup = function() {
    	GroupService.add($scope.group).then(function(response) {
    		//Add the returned group to the local array
    		$scope.currentUser.groups.push(response.data);
    		
    		//Redirect and notify
    		$scope.go('group/'+response.data.id);
    		Notification.show(response.data, 'success');
    	}, function(error) {
    		Notification.show(error.data, 'error');
    	});
    };
  });
