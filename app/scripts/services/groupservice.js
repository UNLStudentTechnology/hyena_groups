'use strict';

/**
 * @ngdoc service
 * @name hyenaGroupsApp.GroupService
 * @description
 * # GroupService
 * Service in the hyenaGroupsApp.
 */
angular.module('hyenaGroupsApp')
  .service('GroupService', function GroupService($http, AuthService, APIPATH, APIKEY) {
    var tokenString = 'token='+AuthService.authToken();
    var apiString = 'api_key='+APIKEY;

  	return {
  		get: function getGroup(groupId, scope) {
  			scope = scope || '';
			return $http.get(APIPATH+'groups/'+groupId+'?with='+scope+'&'+apiString);
		},
		update: function updateGroup(groupId, appData) {
			return $http.put(
				APIPATH+'groups/'+groupId+'?'+tokenString, appData);
		},
		add: function addNewGroup(group) {
			return $http.post(
				APIPATH+'groups?'+tokenString+'&'+apiString, group);
		},
		usersAdd: function usersAdd(groupId, users) {
			return $http.put(
				APIPATH+'groups/'+groupId+'/users?'+tokenString+'&'+apiString, users);
		},
		usersUpdate: function usersUpdate(groupId, userId, userData) {
			return $http.put(
				APIPATH+'groups/'+groupId+'users/'+userId+'?'+tokenString+'&'+apiString, userData);
		},
		usersRemove: function usersRemove(groupId, users) {
			return $http.post(
				APIPATH+'groups/'+groupId+'/users/delete?'+tokenString+'&'+apiString, users);
		}
  	};
  });
