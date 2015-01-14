/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var shareContentToQQSpace = function (accessToken, openId, content) {
    if (accessToken === undefined || openId === undefined || content === undefined) {
        return;
    }
    var url_qq_topic = "https://graph.qq.com/shuoshuo/add_topic";
    var url_qq_topic_params = "oauth_consumer_key=101183443&access_token=" + accessToken + "&openid=" + openId + "&format=json&con=" + content;
    alert(url_qq_topic_params);
    $http.post(url_qq_topic + "?" + url_qq_topic_params).
            success(function () {
                alert("分享成功！");
            })
            .error(function () {
                alert("分享失败，请重试！");
            });
};



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
        $scope.authorized = false;
        if (!QC.Login.check()) {
            $location.path("/login");
            return;
        } else {
            $scope.authorized = true;
        }

        var url_knowledge = "http://ar.hanbell.com.cn:8480/RESTWebService/webresources/irecorder.entity.knowledge";
        var get_knowledge;

        $scope.space = {};
        $scope.space.knowledges;

        $scope.findMore = function (path) {
            alert('');
            $location.path(path);
        };

        QC.Login.getMe(function (openId, accessToken) {
            $scope.space.openId = openId;
            $scope.space.accessToken = accessToken;
        });

        var getKnowledge = function () {
            //alert($scope.space.openId);
            if ($scope.space.openId === undefined) {
                return;
            }
            get_knowledge = url_knowledge + '/userid/' + $scope.space.openId;
            $http.get(get_knowledge).
                    success(function (response)
                    {
                        $scope.space.knowledges = response;
                    })
                    .error(function () {
                        $scope.space.knowledges = [];
                        alert("暂时没有知识记录，赶快添加哦！");
                    });
        };

        $scope.shareToQQSpace = function (content) {
            shareContentToQQSpace($scope.space.accessToken
                    , $scope.space.openId, content);
        };
        
        $scope.$watch('space.openId', getKnowledge);


    }];

var KnowledgeController = ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
        $scope.authorized = false;
        if (!QC.Login.check()) {
            $location.path("/login");
            return;
        } else {
            $scope.authorized = true;
        }

        var url_knowledge = "http://ar.hanbell.com.cn:8480/RESTWebService/webresources/irecorder.entity.knowledge";
        var get_knowledge;

        $scope.space = {};
        $scope.space.knowledges;
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
            var entity = {"userid": $scope.space.openId, "title": $scope.space.knowledgeTitle, "content": $scope.space.knowledgeContent};
            $http.post(url_knowledge, entity)
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
                        $scope.space.knowledges = response;
                    })
                    .error(function () {
                        $scope.space.knowledges = [];
                        alert("暂时没有记录，赶快添加哦！");
                    });
        };

        $scope.shareToQQSpace = function (content) {
            shareContentToQQSpace($scope.space.accessToken
                    , $scope.space.openId, content);
        };

        $scope.$watch('space.openId', getKnowledge);

    }];

var BookController = ['$scope', '$routeParams', '$cookieStore', 'Book',
   function ($scope, $http, $location,Book) {
        $scope.authorized = false;
        if (!QC.Login.check()) {
            $location.path("/login");
            return;
        } else {
            $scope.authorized = true;
        }

        var url_entity = "http://ar.hanbell.com.cn:8480/RESTWebService/webresources/irecorder.entity.knowledge";
        var get_entity;

        $scope.space = {};
        $scope.space.entities;
        $scope.space.entityTitle = '';
        $scope.space.entityContent = '';

        QC.Login.getMe(function (openId, accessToken) {
            $scope.space.openId = openId;
            $scope.space.accessToken = accessToken;
        });

        $scope.addEntity = function () {
            if ($scope.space.entityTitle === undefined || $scope.space.entityContent === undefined) {
                return;
            }
            var entity = {"userid": $scope.space.openId, "title": $scope.space.entityTitle, "content": $scope.space.entityContent};
            $http.post(url_entity, entity)
                    .success(function () {
                        $scope.space.entityTitle = "";
                        $scope.space.entityContent = "";
                        getEntityList();
                        alert("提交成功！");

                    })
                    .error(function () {
                        alert("提交失败，请重试！");
                    });
        };

        var getEntityList = function () {
            //alert($scope.space.openId);
            if ($scope.space.openId === undefined) {
                return;
            }
            get_entity = url_entity + '/userid/' + $scope.space.openId;
            $http.get(get_entity).
                    success(function (response)
                    {
                        $scope.space.entities = response;
                    })
                    .error(function () {
                        $scope.space.entities = [];
                        alert("暂时没有记录，赶快添加哦！");
                    });
        };

        $scope.shareToQQSpace = function (content) {
            shareContentToQQSpace($scope.space.accessToken
                    , $scope.space.openId, content);
        };

        $scope.$watch('space.openId', getEntityList);

    }];
