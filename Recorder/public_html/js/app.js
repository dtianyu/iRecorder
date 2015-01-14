/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('recorderApp', ['recorderService', 'ngCookies']).
        config(['$routeProvider', function ($routeProvider) {
                $routeProvider.
                        when('/login', {templateUrl: 'login.html', controller: AuthController}).
                        when('/space', {templateUrl: 'partials/space.html', controller: SpaceController}).
                        when('/knowledge', {templateUrl: 'partials/knowledge.html', controller: KnowledgeController}).
                        when('/book/', {templateUrl: 'partials/book.html', controller: BookController}).
                        otherwise({redirectTo: 'space'});
            }]);
        
//var app = angular.module('recorderApp', ['recorderService', 'ngCookies']).
//        config(['$routeProvider', function ($routeProvider) {
//                $routeProvider.
//                        when('/login', {templateUrl: 'login.html', controller: UserController}).
//                        when('/space/:userId', {templateUrl: 'partials/space.html', controller: UserController}).
//                        when('/book/:userId', {templateUrl: 'partials/book.html', controller: BookController}).
//                        otherwise({redirectTo: 'login'});
//            }]).
//        config(['$httpProvider', function ($httpProvider) {
//                $httpProvider.responseInterceptors.push(
//                        'securityInterceptor');
//            }]);
//
//function myInterceptor(promise) {
//    return promise.then(function (response) {
//        if (response.headers()['content-type'] === "text/plain") {
//            response.data = $sanitize(response.data);
//        };
//        return response;
//    });
//}