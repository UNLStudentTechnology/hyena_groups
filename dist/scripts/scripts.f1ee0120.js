"use strict";angular.module("hyenaGroupsApp",["ngAnimate","ngCookies","ngResource","ui.router","ngSanitize","ngTouch","angularMoment","hyenaAngular","ngTagsInput","ngStorage","ngCsv"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){a.state("unl-layout",{templateUrl:"views/layouts/unl-layout.html",data:{requireAuth:!0}}).state("unl-layout-kiosk",{templateUrl:"views/layouts/unl-layout-kiosk.html",data:{requireAuth:!1}}).state("unl-layout.main",{url:"/",templateUrl:"views/main.html",controller:"MainCtrl"}).state("unl-layout.new",{url:"/group/new",templateUrl:"views/new.html",controller:"NewCtrl"}).state("unl-layout.group",{url:"/group/:groupId",templateUrl:"views/group.html",controller:"GroupCtrl"}).state("unl-layout.settings",{url:"/group/:groupId/settings",templateUrl:"views/settings.html",controller:"SettingsCtrl"}),b.otherwise("/"),c.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://hyena-groups.firebaseio.com/").constant("APIKEY","MGE0OWQ2ZjUwMDc4YjU0MzdkNTBiNzA4").constant("APIPATH","http://st-studio.unl.edu/hyena_platform/public/api/1.0/").constant("PLATFORM_ROOT","http://st-studio.unl.edu/hyena_platform/public/").constant("AUTH_SCOPE","groups"),angular.module("hyenaGroupsApp").controller("MainCtrl",["$scope",function(){}]),angular.module("hyenaGroupsApp").controller("GroupCtrl",["$scope","$rootScope","$stateParams","$http","$filter","Notification","GroupService","UserService","AppService",function(a,b,c,d,e,f,g,h,i){a.selectedTab=0,a.sortDirection=!1,a.sortField="first_name",a.usersAddList=[],a.selectedUser=null;var j=[];a.csvHeaders=["Membership Date","Email Address","First Name","Last Name","BB Username","Major","Year","College","Department"];var k=b.currentGroupId=parseInt(c.groupId);g.get(k,"users,apps").then(function(b){a.group=b.data,a.members=b.data.users,a.group_apps=b.data.apps},function(){f.show("Sorry! Unable to load your group.","error")}),i.all().then(function(b){a.apps=b.data},function(){f.show("Sorry! Unable to load apps from the store.","error")}),a.toggleSort=function(){a.sortDirection=!a.sortDirection},a.toggleGroupApp=function(b){e("filter")(a.group_apps,{id:b.id}).length>0?m(b):l(b)};var l=function(b){var c={apps:[b.id]};g.appsAdd(k,c).then(function(){a.group_apps.push(b)},function(a){angular.isDefined(a.data.message)?f.show(a.data.message,"error"):f.show("Sorry! There was an error.","error")})},m=function(a){var b={apps:[a.id]};g.appsRemove(k,b).then(function(){},function(a){angular.isDefined(a.data.message)?f.show(a.data.message,"error"):f.show("Sorry! There was an error.","error")})};a.addUsers=function(){var b={users:[]};angular.forEach(a.usersAddList,function(a){b.users.push(a.text)}),g.usersAdd(k,b).then(function(b){a.usersAddList=[],angular.forEach(b.data.users_added,function(b){a.members.push(b)}),f.hideModal(),f.show(b.data.message,"success")},function(a){f.show(a.data,"error")})},a.showAddModal=function(){f.showModal("Add new members","#modal-members-add")},a.updateUser=function(a){angular.isDefined(a)&&g.usersUpdate(k,a.uni_auth,a).then(function(a){f.show(a.data.message,"success")},function(a){console.log("Update User Error",a),a.message?f.show(a.data.message,"error"):f.show("Sorry! There was an error.","error")})},a.removeUsers=function(){for(var b={users:[]},c=0;c<j.length;c++)b.users.push(j[c][1]);g.usersRemove(k,b).then(function(b){for(var c=0;c<j.length;c++)a.members.splice(a.members.indexOf(j[c][0]),1);j=[],f.hideModal(),f.show(b.data.message,"success")},function(a){f.show(a.data,"error")})},a.showRemoveModal=function(b){j=[],j.push([b,b.uni_auth]),a.selectedUser=b.uni_auth,f.showModal("","#modal-member-remove")},a.splitTags=function(b){var c=b.text.split(",");if(c.length>1){a.usersAddList.pop();for(var d=0;d<c.length;d++)c[d]=c[d].toString().trim(),a.usersAddList.push({text:c[d]});console.log(a.usersAddList)}},a.getExportArray=function(){return h["export"](a.members)}}]),angular.module("hyenaGroupsApp").controller("SettingsCtrl",["$scope","$rootScope","$stateParams","GroupService",function(a,b,c,d){var e=b.currentGroupId=parseInt(c.groupId);d.get(e,"users").then(function(b){a.group=b.data,a.members=b.data.users})}]),angular.module("hyenaGroupsApp").controller("NewCtrl",["$scope","Notification","GroupService",function(a,b,c){a.group={title:"",description:""},a.createGroup=function(){c.add(a.group).then(function(c){a.currentUser.groups.push(c.data),a.go("group/"+c.data.id),b.show(c.data,"success")},function(a){b.show(a.data,"error")})}}]);