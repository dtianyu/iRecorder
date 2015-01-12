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
//                        
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
        var get_knowledge;
        $scope.authorized = QC.Login.check();
        //alert($scope.authorized);
        $scope.space = {};
        $scope.knowledges;
        $scope.space.knowledgeTitle = '';
        $scope.space.knowledgeContent = '';

        QC.Login.getMe(function (openId, accessToken) {
            $scope.space.openId = openId;
            $scope.space.accessToken = accessToken;
        });

        $scope.addKnowledge = function () {
            if ($scope.space.knowledgeTitle === undefined || $scope.space.knowledgeContent === undefined) {
                return;
            }
            var k = {"userid": $scope.space.openId, "title": $scope.space.knowledgeTitle, "content": $scope.space.knowledgeContent};
            $http.post(url_knowledge, k)
                    .success(function () {
                        $scope.space.knowledgeTitle = "";
                        $scope.space.knowledgeContent = "";
                        getKnowledge();
                        alert("提交成功！");

                    })
                    .error(function () {
                        alert("提交失败，请重试！");
                    });
        };

        var getKnowledge = function () {
            //alert($scope.space.openId);
            if ($scope.space.openId === undefined) {
                return;
            }
            get_knowledge = url_knowledge + '/userid/' + $scope.space.openId;
            $http.get(get_knowledge).
                    success(function (response)
                    {
                        $scope.knowledges = response;
                    })
                    .error(function () {
                        $scope.knowledges = [];
                        alert("暂时没有知识记录，赶快添加哦！");
                    });
        };

        $scope.shareKnowledgeToQQSpace = function (content) {
            if ($scope.space.accessToken === undefined || $scope.space.openId === undefined || content === undefined) {
                return;
            }
            var url_qq_topic = "https://graph.qq.com/shuoshuo/add_topic";
            var url_qq_topic_params = "oauth_consumer_key=101183443&access_token=" + $scope.space.accessToken + "&openid=" + $scope.space.openId + "&format=json&con=" + content + "";
            alert(url_qq_params);
            $http.post(url_qq_topic+"?"+url_qq_topic_params).
                    success(function () {
                        alert("分享成功！");
                    })
                    .error(function () {
                        alert("分享失败，请重试！");
                    });
        };

        $scope.$watch('space.openId', getKnowledge);


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
