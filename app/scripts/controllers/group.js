'use strict';

/**
 * @ngdoc function
 * @name hyenaGroupsApp.controller:GroupCtrl
 * @description
 * # GroupCtrl
 * Controller of the hyenaGroupsApp
 */
angular.module('hyenaGroupsApp')
  .controller('GroupCtrl', function ($scope, $rootScope, $stateParams, $http, $filter, Notification, GroupService, UserService, AppService) {
  	$scope.searchVisible = true;
    $scope.doingAddUsers = false;
    //Initialize tab index var
  	$scope.selectedTab = 0;
    $scope.selectedRoleTab = 0;
    //Initialize sort variables
  	$scope.sortDirection = false;
  	$scope.sortField = "first_name";
  	//Initialize user addition list for ng-tag-list
  	$scope.usersAddList = [];
  	//Variables for deletion
  	$scope.selectedUser = null;
  	var deleteKeys = [];
    //CSV Export Headers
    $scope.csvHeaders = ['Membership Date', 'Email Address', 'First Name', 'Last Name', 'BB Username', 'Major', 'Year', 'College', 'Department'];

  	//Get the requested group by ID
    var groupId = $rootScope.currentGroupId = parseInt($stateParams.groupId);
    GroupService.get(groupId, 'users,apps').then(function(response) {
  		$scope.group = response.data;
  		$scope.members = response.data.users;
  		$scope.group_apps = response.data.apps;
    }, function(error) {
      Notification.show('Sorry! Unable to load your group.', 'error');
    });

    //Load apps from the store
    AppService.all().then(function(response) {
      $scope.apps = response.data;
    }, function(error) {
      Notification.show('Sorry! Unable to load apps from the store.', 'error');
    });

    /**
     * Toggles the sort direction on the member list.
     */
    $scope.toggleSort = function() {
    	$scope.sortDirection = !$scope.sortDirection;
    };

    $scope.toggleSearch = function() {
      $scope.searchVisible = !$scope.searchVisible;
    };

    $scope.toggleGroupApp = function(app) {
      if($filter('filter')($scope.group_apps, {id:app.id}).length > 0)
        removeGroupApp(app);
      else
        addGroupApp(app);
    };

    /**
     * Changes the details under each user depending on which sorting filter is used.
     * @param  object member User from Platform
     * @return string
     */
    $scope.showUserDetails = function(member) {
      switch ($scope.sortField) {
        case "pivot.created_at" :
          return ($filter('amCalendar')(member.pivot.created_at));
        default :
          return ($filter('uni_year')(member.uni_year)) +' in '+ (member.uni_major || member.uni_dept);
      }

    };

    /**
     * Add app(s) to group
     */
    var addGroupApp = function(app) {
      var apps = {apps:[ app.id ]};
      GroupService.appsAdd(groupId, apps).then(function(response) {
        Notification.show(response.data.message, 'success');
        $scope.group_apps.push(app);
      }, function(error) {
        if(angular.isDefined(error.data.message))
          Notification.show(error.data.message, 'error');
        else
          Notification.show('Sorry! There was an error.', 'error');
      });
    };

    /**
     * Remove app(s) from group
     */
    var removeGroupApp = function(app) {
      var apps = {apps:[ app.id ]};
      GroupService.appsRemove(groupId, apps).then(function(response) {
        Notification.show(response.data.message, 'success');
        //$scope.group_apps.splice(app);

        for (var i = 0; i < $scope.group_apps.length; i++) {
          if($scope.group_apps[i].id === app.id) {
            $scope.group_apps.splice(i, 1);
            break;
          }
        }

      }, function(error) {
        if(angular.isDefined(error.data.message))
          Notification.show(error.data.message, 'error');
        else
          Notification.show('Sorry! There was an error.', 'error');
      });
    };

    /**
     * Adds new users to an existing group. Shows a notification based on the response.
     */
    $scope.addUsers = function() {
      $scope.doingAddUsers = true;
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
        $scope.doingAddUsers = false;
    	}, function(error) {
    		Notification.show(error.data, 'error');
        $scope.doingAddUsers = false;
    	});
    };

    $scope.showAddModal = function() {
    	Notification.showModal('Add new members', '#modal-members-add');
    };

    $scope.updateUser = function(user) {
      if(angular.isDefined(user)) {
        GroupService.usersUpdate(groupId, user.uni_auth, user).then(function(response) {
          Notification.show(response.data.message, 'success');
        }, function(error) {
            console.log('Update User Error', error);
          if(error.message)
            Notification.show(error.data.message, 'error');
          else
            Notification.show('Sorry! There was an error.', 'error');
        });
      }
    };

    /**
     * Removes users from a group
     */
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
      deleteKeys = [];
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

    /**
     * Returns a clean array to be exported to CSV
     * @return array Array of users
     */
    $scope.getExportArray = function() {
      return UserService.export($scope.members);
    };
  });
