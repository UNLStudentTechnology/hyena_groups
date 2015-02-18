"use strict";angular.module("hyenaGroupsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","hyenaAngular","ngTagsInput","ngStorage","ngCsv"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/group/new",{templateUrl:"views/new.html",controller:"NewCtrl"}).when("/group/:groupId",{templateUrl:"views/group.html",controller:"GroupCtrl"}).when("/group/:groupId/settings",{templateUrl:"views/settings.html",controller:"SettingsCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://hyena-groups.firebaseio.com/").constant("APIKEY","MGE0OWQ2ZjUwMDc4YjU0MzdkNTBiNzA4").constant("APIPATH","http://st-studio.unl.edu/hyena_platform/public/api/1.0/").constant("PLATFORM_ROOT","http://st-studio.unl.edu/hyena_platform/public/").constant("AUTH_SCOPE","groups"),angular.module("hyenaGroupsApp").controller("MainCtrl",["$scope",function(){}]),angular.module("hyenaGroupsApp").controller("GroupCtrl",["$scope","$rootScope","$routeParams","$http","Notification","GroupService","UserService",function(a,b,c,d,e,f,g){a.selectedTab=0,a.sortDirection=!1,a.sortField="first_name",a.usersAddList=[],a.selectedUser=null;var h=[];a.csvHeaders=["Membership Date","Email Address","First Name","Last Name","BB Username","Major","Year","College","Department"];var i=b.currentGroupId=parseInt(c.groupId);f.get(i,"users,apps").then(function(b){a.group=b.data,a.members=b.data.users,a.apps=b.data.apps}),a.toggleSort=function(){a.sortDirection=!a.sortDirection},a.addUsers=function(){var b={users:[]};angular.forEach(a.usersAddList,function(a){b.users.push(a.text)}),f.usersAdd(i,b).then(function(b){a.usersAddList=[],angular.forEach(b.data.users_added,function(b){a.members.push(b)}),e.hideModal(),e.show(b.data.message,"success")},function(a){e.show(a.data,"error")})},a.showAddModal=function(){e.showModal("Add new members","#modal-members-add")},a.removeUsers=function(){for(var b={users:[]},c=0;c<h.length;c++)b.users.push(h[c][1]);f.usersRemove(i,b).then(function(b){for(var c=0;c<h.length;c++)a.members.splice(a.members.indexOf(h[c][0]),1);h=[],e.hideModal(),e.show(b.data.message,"success")},function(a){e.show(a.data,"error")})},a.showRemoveModal=function(b){h=[],h.push([b,b.uni_auth]),a.selectedUser=b.uni_auth,e.showModal("","#modal-member-remove")},a.splitTags=function(b){var c=b.text.split(",");if(c.length>1){a.usersAddList.pop();for(var d=0;d<c.length;d++)c[d]=c[d].toString().trim(),a.usersAddList.push({text:c[d]});console.log(a.usersAddList)}},a.getExportArray=function(){return g["export"](a.members)}}]),angular.module("hyenaGroupsApp").controller("SettingsCtrl",["$scope","$rootScope","$routeParams","GroupService",function(a,b,c,d){var e=b.currentGroupId=parseInt(c.groupId);d.get(e,"users").then(function(b){a.group=b.data,a.members=b.data.users})}]),angular.module("hyenaGroupsApp").controller("NewCtrl",["$scope","Notification","GroupService",function(a,b,c){a.group={title:"",description:""},a.createGroup=function(){c.add(a.group).then(function(c){a.currentUser.groups.push(c.data),a.go("group/"+c.data.id),b.show(c.data,"success")},function(a){b.show(a.data,"error")})}}]);