/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('recorderApp', ['recorderService','ngCookies']).
        config(['$routeProvider', function ($routeProvider) {
                $routeProvider.
                        when('/login', {templateUrl: 'login.html', controller: UserController}).
                        when('/space/:userId', {templateUrl: 'partials/space.html', controller: UserController}).
                        when('/book/:userId', {templateUrl: 'partials/book.html', controller: BookController}).
                        otherwise({redirectTo: 'login'});
            }]);
