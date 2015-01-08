/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var AuthController = ['$scope', '$http', '$location',
    function ($scope, $http, $location) {

        $scope.authorized = QC.Login.check();
        //alert($scope.authorized);
        if (QC.Login.check()) {
            $location.path("/space");
        }
//        var key_cookie = "cn.lightshell.recorder.auth";
//        var url_login = "http://ar.hanbell.com.cn:8480/RESTWebService/webresources/irecorder.entity.sysuser/";
//        $scope.userid;
//        $scope.pwd;
// $scope.user;
//        $scope.login = function () {
//            url_login = url_login + $scope.userid + "-" + $scope.pwd;
//            $http.get(url_login)
//                    .success(function (response)
//                    {
//                        $scope.user = response;
//                        $cookieStore.put(key_cookie, $scope.user);
//                        $location.path("/space/" + $scope.user.id);
//                    })
//                    .error(function () {
//                        alert("登录失败，请重试！");
//                    });
//        };
    }];

var SpaceController = ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
        if (!QC.Login.check()) {
            $location.path("/login");
            return;
        }
        var url_knowledge = "http://ar.hanbell.com.cn:8480/RESTWebService/webresources/irecorder.entity.knowledge";
        $scope.authorized = QC.Login.check();
        alert($scope.authorized);
        $scope.openId;
        $scope.accessToken;
        $scope.space;
        $scope.knowledges;
        $scope.knowledgeTitle;
        $scope.knowledgeContent;
        if (QC.Login.check()) {
            QC.Login.getMe(function (openId, accessToken) {
                $scope.openId = openId;
                $scope.accessToken = accessToken;
            });

            var get_knowledge = url_knowledge + "/userid-" + $scope.openId;
            $http.get(get_knowledge).
                    success(function (response)
                    {
                        $scope.knowledges = response;
                    })
                    .error(function () {
                        $scope.knowledges = [];
                        alert("暂时没有知识记录，赶快添加哦！");
                    });
        }

        $scope.addKnowledge = function () {
            if ($scope.knowledgeTitle === undefined || $scope.knowledgeContent === undefined) {
                return;
            }
            var ts = new Date().getTime();
            var k = {"userid": $scope.openId, "title": $scope.knowledgeTitle, "content": $scope.knowledgeContent, "dayadd": ts};
            $http.post(url_knowledge, k)
                    .success(function () {
                        alert("提交成功！");
                    })
                    .error(function () {
                        alert("提交失败，请重试！");
                    });
        };

    }];

var BookController = ['$scope', '$routeParams', '$cookieStore', 'Book',
    function ($scope, $routeParams, $cookieStore, Book) {
        alert(QC.Login.check());
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
