/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('recorderService', ['ngResource']).
        factory('Space', function ($resource) {
            return $resource("app/users/:userId.json");
        }).
        factory('Book', function ($resource) {
            return $resource("app/books/books:userId.json");
        });
//        .
//        factory('securityInterceptor',['$injector', 'securityRetryQueue',
//            function ($injector, queue) {
//                return function (promise) {
//                    var $http = $injector.get('$http');
//                    return promise.then(null, function (response) {
//                        if (response.status === 401) {
//                            promise = queue.pushRetryFn('unauthorized-server',
//                                    function () {
//                                        return $http(response.config);
//                                    }
//                            );
//                        }
//                        return promise;
//                    });
//                };
//            }]);