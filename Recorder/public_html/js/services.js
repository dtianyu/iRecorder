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
            return $resource("app/users/:userId_book.json");
        })
        ;