'use strict';

describe('Filter: uni', function () {

  // load the filter's module
  beforeEach(module('hyenaGroupsApp'));

  // initialize a new instance of the filter before each test
  var uni;
  beforeEach(inject(function ($filter) {
    uni = $filter('uni');
  }));

  it('should return the input prefixed with "uni filter:"', function () {
    var text = 'angularjs';
    expect(uni(text)).toBe('uni filter: ' + text);
  });

});
