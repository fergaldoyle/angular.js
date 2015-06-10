(function () {
  'use strict';

  console.clear();

  angular.module('ie8Test', [
  'ie8Test.home',
  'ie8Test.about',
  'ie8Test.directives',
  'ie8Test.filters',
  'ngRoute',
  'ngAria',
  'ngAnimate',
  'ngCookies',
  'ngMessages',
  'ngResource',
  'ngSanitize'
 ])

  .factory('config', function () {
    return {
      foo: 'bar'
    };
  })

  .run(function ($rootScope, $http, config) {

    console.log('should get data');
    $http.get('data.json').then(function (d) {
      console.log('$http.get OK: ' + JSON.stringify(d.data))
    });

    console.log('should get jsonp');
    $http.jsonp('https://librivox.org/api/feed/audiobooks/author/Melville?format=jsonp&callback=JSON_CALLBACK').then(function (d) {
      console.log('$http.jsonp OK: ' + d.data.books.length + ' results');
    });

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      console.log('$routeChangeStart');
    });

    // test jquery ajax to check if monkey patch breaks it
    var jqxhr = $.ajax('data.json')
      .done(function (data) {
        console.log('jquery: ' + JSON.stringify(data));
      })
      .fail(function () {
        console.log('jquery error');
      })
      .always(function () {
        console.log('jquery always');
      });

  })

  .config(function ($routeProvider) {

    $routeProvider
      .when('/home', {
        templateUrl: 'app/home/home.tmpl.html',
        controller: 'homeCtrl'
      })

    .when('/about', {
      templateUrl: 'app/about/about.tmpl.html',
      controller: 'aboutCtrl'
    })

    .otherwise({
      redirectTo: '/home'
    });
  })

  .animation('.js-show-animation', function () {
    return {
      beforeAddClass: function (element, className, done) {
        if (className === 'ng-hide') {
          element.animate({
            opacity: 0
          }, 1000, done);
        } else {
          done();
        }
      },
      removeClass: function (element, className, done) {
        if (className === 'ng-hide') {
          element.css('opacity', 0);
          element.animate({
            opacity: 1
          }, 1000, done);
        } else {
          done();
        }
      }
    };
  });

  var $p = $('<p />').text('checking textContent');
  console.log($p[0].textContent);


}());
