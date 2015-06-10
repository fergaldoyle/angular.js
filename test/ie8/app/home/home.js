angular.module('ie8Test.home', []).controller('homeCtrl', function ($scope, $filter) {

  $scope.message = 'This is the home view';
  $scope.messageHTML = '<strong>This is the home view</strong>';

  $scope.name = 'Foo';

  $scope.updateName = function () {
    $scope.name = $scope.name + Math.random();
  };

  $scope.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  $scope.letters = "abcdefghi";
  $scope.longNumber = 2345432342;
  $scope.numLimit = 3;
  $scope.letterLimit = 3;
  $scope.longNumberLimit = 3;

  $scope.colors = [{
      name: 'black',
      shade: 'dark'
    },
    {
      name: 'white',
      shade: 'light'
    },
    {
      name: 'red',
      shade: 'dark'
    },
    {
      name: 'blue',
      shade: 'dark'
    },
    {
      name: 'yellow',
      shade: 'light'
  }];

  $scope.myColor = $scope.colors[2]; // red

  var people = [{
      name: 'Joe',
      age: 20
    },
    {
      name: 'Jane',
      age: 27
    },
    {
      name: 'Mick',
      age: 32
  }];

  // test copy
  $scope.people = angular.copy(people);
  angular.copy({foo:'bar'});
  angular.copy('foo');
  angular.copy(new Date());

  // test extend
  angular.extend($scope, {

    options: [
      {
        label: 'Item 1',
        value: 1
      },
      {
        label: 'Item 2',
        value: 2
      },
      {
        label: 'Item 3',
        value: 3
      }
    ],

    model: {},

    addOption: function () {

      var i = $scope.options[$scope.options.length - 1].value + 1;

      $scope.options.push({
        label: 'Item ' + i,
        value: i
      });
    }

  });

  // test date filter
  var date = $filter('date')(new Date(Date.UTC(2003, 8, 10, 3, 2, 4)), 'yyyy-MM-dd HH-mm-ssZ', 'GMT+0500');
  console.log(date);

});
