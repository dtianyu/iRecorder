/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var UserController=['$scope', '$routeParams', '$http', '$location', '$cookieStore', 'Space',
    function($scope, $routeParams, $http, $location, $cookieStore, Space) {

    var key_cookie = "cn.lightshell.recorder.auth";
    var url_login = "http://recorder.myeer.cn:8480/RESTWebService/webresources/irecorder.entity.sysuser/";
    $scope.userid;
    $scope.pwd;
    $scope.user = $cookieStore.get(key_cookie);
    $scope.space;
    if (($scope.user === undefined) || ($scope.user === null)) {
        $location.path("/login");
    }

    if (($routeParams.userId !== undefined) && ($routeParams.userId !== $scope.user.id.toString())) {
        $location.path("/login");
    }

    if (($routeParams.userId !== undefined) && ($routeParams.userId !== null)) {
        $scope.space = Space.get({userId: $routeParams.userId});
    }

    $scope.login = function () {
        url_login = url_login + $scope.userid + "-" + $scope.pwd;
        $http.get(url_login)
                .success(function (response)
                {
                    $scope.user = response;
                    $cookieStore.put(key_cookie, $scope.user);
                    $location.path("/space/" + $scope.user.id);
                })
                .error(function () {
                    alert("登录失败，请重试！");
                });
    };
}];
//    function securityMD5() {
//
//        alert('123');
//        $scope.md5value = $scope.nikename;
////        return $(md5(value));
//    }
//    ;

var BookController = ['$scope', '$routeParams', '$cookieStore', 'Book',
    function ($scope, $routeParams, $cookieStore, Book) {

        var key_cookie = "cn.lightshell.recorder.auth";
        $scope.user = $cookieStore.get(key_cookie);
        $scope.books;
        if (($scope.user === undefined) || ($scope.user === null)) {
            $location.path("/login");
        }

        if (($routeParams.bookId !== undefined) && ($routeParams.bookId !== $scope.user.id.toString())) {
            $location.path("/login");
        }

        if (($routeParams.userId !== undefined) && ($routeParams.userId !== null)) {
            $scope.books = Book.get({userId: $routeParams.userId});
        }

    }];
