/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var home_url = "http://ar.hanbell.com.cn:8480/RESTWebService/webresources";

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
            top: function (userId, $scope) {
                if (userId !== undefined && userId !== "") {
                    var url = base_url + '/userid/' + userId + '/top/5';
                    return $http.get(url).success(function (response) {
                        $scope.space.knowledges = response;
                    }).error(function () {
                        alert("获取资料失败");
                    });
                }
            },
            get: function (userId, Id, $scope) {
                if (userId !== undefined && userId !== "" && Id !== undefined && Id !== "") {
                    var url = base_url + '/userid/' + userId + '/id/' + Id;
                    return $http.get(url).success(function (response) {
                        $scope.space.knowledge = response;
                    }).error(function () {
                        alert("获取资料失败");
                    });
                }
            },
            add: function (entity, $scope) {
                $http.post(base_url, entity)
                        .success(function () {
                            $scope.getEntityData();
                            alert("提交成功！");
                        })
                        .error(function () {
                            alert("提交失败，请重试！");
                        });
            },
            del: function (userId, Id, $scope) {
                var url = base_url + '/userid/' + userId + '/id/' + Id;
                $http({method: 'DELETE', url: url})
                        .success(function () {
                            $scope.getEntityData();
                            alert("删除成功！");
                        })
                        .error(function () {
                            alert("删除失败，请重试！");
                        });
            },
            save: function (userId, Id, entity, $scope) {
                var url = base_url + '/userid/' + userId + '/id/' + Id;
                $http({method: 'PUT', url: url, data: entity})
                        .success(function () {
                            $scope.hideEditModal();
                            alert("更新成功！");
                        })
                        .error(function () {
                            alert("更新失败，请重试！");
                        });
            }
        };
    }]);

recorderService.factory('BookChapter', ['$http', function ($http) {
        var base_url = home_url + "/irecorder.entity.bookchapter";
        return {
            query: function (userId, bookId, $scope) {
                var url = base_url + '/userid/' + userId + '/bookId/' + bookId;
                return $http.get(url).success(function (response) {
                    $scope.space.book.chapters = response;
                }).error(function () {
                    alert("获取资料失败");
                });
            },
            get: function (userId, bookId, Id, $scope) {
                if (bookId !== undefined && bookId !== "" && Id !== undefined && Id !== "") {
                    var url = base_url + '/userid/' + userId + '/bookId/' + bookId + '/id/' + Id;
                    return $http.get(url).success(function (response) {
                        $scope.space.book.chapter = response;
                    }).error(function () {
                        alert("获取资料失败");
                    });
                }
            },
            add: function (entity, $scope) {
                $http.post(base_url, entity)
                        .success(function () {
                            $scope.getEntityData();
                            alert("提交成功！");
                        })
                        .error(function () {
                            alert("提交失败，请重试！");
                        });
            },
            del: function (userId, bookId, Id, $scope) {
                var url = base_url + '/userid/' + userId + '/bookId/' + bookId + '/id/' + Id;
                $http({method: 'DELETE', url: url})
                        .success(function () {
                            $scope.getEntityData();
                            alert("删除成功！");
                        })
                        .error(function () {
                            alert("删除失败，请重试！");
                        });
            },
            save: function (userId, bookId, Id, entity, $scope) {
                var url = base_url + '/userid/' + userId + '/bookId/' + bookId + '/id/' + Id;
                $http({method: 'PUT', url: url, data: entity})
                        .success(function () {
                            $scope.hideEditModal();
                            alert("更新成功！");
                        })
                        .error(function () {
                            alert("更新失败，请重试！");
                        });
            }
        };
    }]);

recorderService.factory('Book', ['$http', 'BookChapter', function ($http, BookChapter) {
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
            top: function (userId, $scope) {
                if (userId !== undefined && userId !== "") {
                    var url = base_url + '/userid/' + userId + '/top/5';
                    return $http.get(url).success(function (response) {
                        $scope.space.books = response;
                    }).error(function () {
                        alert("获取资料失败");
                    });
                }
            },
            get: function (userId, Id, $scope) {
                if (userId !== undefined && userId !== "" && Id !== undefined && Id !== "") {
                    var url = base_url + '/userid/' + userId + '/id/' + Id;
                    return $http.get(url).success(function (response) {
                        $scope.space.book = response;
                        BookChapter.query(userId, $scope.space.book.id, $scope);
                    }).error(function () {
                        alert("获取资料失败");
                    });
                }
            },
            add: function (entity, $scope) {
                $http.post(base_url, entity)
                        .success(function () {
                            $scope.getEntityData();
                            alert("提交成功！");
                        })
                        .error(function () {
                            alert("提交失败，请重试！");
                        });
            },
            del: function (userId, Id, $scope) {
                var url = base_url + '/userid/' + userId + '/id/' + Id;
                $http({method: 'DELETE', url: url})
                        .success(function () {
                            $scope.getEntityData();
                            alert("删除成功！");
                        })
                        .error(function () {
                            alert("删除失败，请重试！");
                        });
            },
            save: function (userId, Id, entity, $scope) {
                var url = base_url + '/userid/' + userId + '/id/' + Id;
                $http({method: 'PUT', url: url, data: entity})
                        .success(function () {
                            $scope.hideEditModal();
                            alert("更新成功！");
                        })
                        .error(function () {
                            alert("更新失败，请重试！");
                        });
            }
        };
    }]);

