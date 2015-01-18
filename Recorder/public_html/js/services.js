/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var recorderService = angular.module('recorderService', ['ngResource']);

recorderService.factory('Knowledge', ['$http', function ($http) {
        var base_url = "http://ar.hanbell.com.cn:8480/RESTWebService/webresources/irecorder.entity.knowledge";
        return {
            query: function (userId, $scope) {
                if (userId !== undefined && userId !== "") {
                    var url = base_url + '/userid/' + userId;
                    return $http.get(url).success(function (response) {
                        $scope.space.knowledges = response;
                    }).error(function () {
                        alert("获取资料失败");
                    });
                }
            },
            delete: function (userId, Id) {
                var url = base_url + '/userid/' + userId + '/id/' + Id;
                $http({method: 'DELETE', url: url})
                        .success(function () {
                            alert("删除成功！");
                        })
                        .error(function () {
                            alert("删除失败，请重试！");
                        });
            },
            add: function (entity, $scope) {
                $http.post(base_url, entity)
                        .success(function () {
                            alert("提交成功！");
                            $scope.getEntityList();
                        })
                        .error(function () {
                            alert("提交失败，请重试！");
                        });
            }
        };
    }]);

recorderService.factory('Book', ['$http', function ($http) {
        var base_url = "http://ar.hanbell.com.cn:8480/RESTWebService/webresources/irecorder.entity.book";
        return {
            query: function (userId, $scope) {
                var url = base_url + '/userid/' + userId;
                return $http.get(url).success(function (response) {
                    $scope.space.books = response;
                }).error(function () {
                    alert("获取资料失败");
                });
            },
            delete: function (userId, Id) {
                var url = base_url + '/userid/' + userId + '/id/' + Id;
                $http({method: 'DELETE', url: url})
                        .success(function () {
                            alert("删除成功！");
                        })
                        .error(function () {
                            alert("删除失败，请重试！");
                        });
            },
            add: function (entity, $scope) {
                $http.post(base_url, entity)
                        .success(function () {
                            alert("提交成功！");
                            $scope.getEntityList();
                        })
                        .error(function () {
                            alert("提交失败，请重试！");
                        });
            }
        };
    }]);
