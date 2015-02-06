'use strict';

/**
 * @ngdoc function
 * @name hyenaGroupsApp.controller:GroupCtrl
 * @description
 * # GroupCtrl
 * Controller of the hyenaGroupsApp
 */
angular.module('hyenaGroupsApp')
  .controller('GroupCtrl', function ($scope, $rootScope, $routeParams, Notification, GroupService) {
  	//Initialize tab index var
  	$scope.selectedTab = 0;
  	$scope.sortDirection = false;
  	$scope.sortField = "first_name";
  	//Initialize user addition list for ng-tag-list
  	$scope.usersAddList = [];
  	//Variables for deletion
  	$scope.selectedUser = null;
  	var deleteKeys = [];

  	//Get the requested group by ID
    var groupId = $rootScope.currentGroupId = parseInt($routeParams.groupId);
    GroupService.get(groupId, 'users,apps').then(function(response) {
		$scope.group = response.data;
		$scope.members = response.data.users;
		$scope.apps = response.data.apps;
    });

    /**
     * Toggles the sort direction on the member list.
     */
    $scope.toggleSort = function() {
    	$scope.sortDirection = !$scope.sortDirection;
    };

    /**
     * Adds new users to an existing group. Shows a notification based on the response.
     */
    $scope.addUsers = function() {
    	var userObject = {users:[]};
    	angular.forEach($scope.usersAddList, function(value, key) {
			userObject.users.push(value.text);
		});

    	GroupService.usersAdd(groupId, userObject).then(function(response) {
    		//Clear the tag list
    		$scope.usersAddList = [];
    		//Loop through new group members and add them to active list
    		angular.forEach(response.data.users_added, function(value, key) {
				$scope.members.push(value);
			});
			//Show notification
			Notification.hideModal();
    		Notification.show(response.data.message, 'success');
    	}, function(error) {
    		Notification.show(error.data, 'error');
    	});
    };

    $scope.showAddModal = function() {
    	Notification.showModal('Add new members', '#modal-members-add');
    };

    $scope.removeUsers = function() {
    	var userObject = {users:[]};
    	//Add user_ids to userObject list
    	for (var i = 0; i < deleteKeys.length; i++) {
			userObject.users.push(deleteKeys[i][1]);
		}
    	
    	GroupService.usersRemove(groupId, userObject).then(function(response) {
    		//Remove users locally
    		for (var i = 0; i < deleteKeys.length; i++) {
    			$scope.members.splice($scope.members.indexOf(deleteKeys[i][0]), 1);
    		}
    		deleteKeys = [];

    		//Show notification
    		Notification.hideModal();
    		Notification.show(response.data.message, 'success');
    	}, function(error) {
    		Notification.show(error.data, 'error');
    	});
    };

    $scope.showRemoveModal = function(userObject) {
    	deleteKeys.push([userObject, userObject.uni_auth]);
    	$scope.selectedUser = userObject.uni_auth;
    	Notification.showModal('', '#modal-member-remove');
    };


    $scope.splitTags = function(tag) {
    	var tagArray = tag.text.split(',');

    	if(tagArray.length > 1)
    	{
    		$scope.usersAddList.pop();
	    	for (var i = 0; i < tagArray.length; i++) {
	    		tagArray[i] = tagArray[i].toString().trim();
	    		$scope.usersAddList.push({ text: tagArray[i] });
	    	}
	    	console.log($scope.usersAddList);
	    }
    };
  });
