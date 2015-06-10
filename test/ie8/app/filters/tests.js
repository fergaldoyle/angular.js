angular.module('ie8Test.filters', [])

.filter('checkmark', function () {
  return function (input) {
    return input ? '\u2713' : '\u2718';
  };
});
