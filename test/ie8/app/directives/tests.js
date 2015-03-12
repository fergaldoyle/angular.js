angular.module('ie8Test.directives', [])

.directive('dirA', function () {
  return {
    restrict: 'EAC',
    scope: {},
    template: '<span><h3>dirA</h3> {{foo}}</span>',
    link: function (scope, elm, attrs) {
      scope.foo = 'foo';
    }
  };
})

.directive('dirB', function () {
  return {
    restrict: 'EA',
    transclude: true,
    controller: function ($scope) {
      $scope.tasks = $scope.tasks || [];
      $scope.addTask = function () {
        $scope.tasks.push({
          title: $scope.title
        });
      };
    },
    template: '<h3>dirB</h3><div>Name: <input type="text" ng-model="title" />&nbsp;' +
      '<button ng-click="addTask()">Add Task</button>' +
      '<div class="taskContainer"><br />' +
      '<div ng-transclude></div>' +
      '</div></div>'
  };
})

.directive('dirC', function ($compile, $rootScope) {
  return {
    restrict: 'EAC',
    template: '<span></span>',
    link: function (scope, elm, attrs) {

      var foo = angular.element('<div>{{a=123}}xxx</div>');
      console.log(foo.html());

      setTimeout(function () {
        var element = $compile(angular.element('<div>{{a=123}}</div>'))($rootScope);
        $rootScope.$digest();
        elm.html('<h3>dirC</h3>' + angular.element(element).text());
      }, 300);
    }
  };
})

.directive('dirD', function () {
  return {
    restrict: 'EAC',
    scope: {},
    templateUrl: 'app/directives/tmpl.html',
    link: function (scope, elm, attrs) {
      scope.foo = 'foo';
    }
  };
})

;
