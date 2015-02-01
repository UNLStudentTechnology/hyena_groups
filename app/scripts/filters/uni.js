'use strict';

/**
 * @ngdoc filter
 * @name hyenaGroupsApp.filter:uni
 * @function
 * @description
 * # uni
 * Filter in the hyenaGroupsApp.
 */
angular.module('hyenaGroupsApp')
	/**
	 * Returns a pretty version of the uni_year code from Hyena.
	 * @return string   Pretty Year
	 */
  .filter('uni_year', function () {
    return function (input) {
    	switch (input) {
    		case "FR" :
    			return "Freshman";
    		case "SO" :
    			return "Sophomore";
			case "JR" :
				return "Junior";
			case "SR" :
				return "Senior";
			case "GR" :
				return "Graduate";
			default :
				return "N/A";
    	}
    };
  })
  .filter('uni_major', function () {
    return function (input) {
    	return input;
    };
  });
