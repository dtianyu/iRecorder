/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var getTimestamp = function () {
    return Math.round(new Date().getTime() / 1000);
};

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

var AuthController = ['$scope', '$location',
    function ($scope, $location) {

        $scope.authorized = false;
        if (QC.Login.check()) {
            $scope.authorized = true;
            $location.path("/space");
        }

    }];

var SpaceController = ['$scope', '$routeParams', '$http', '$location',
    function ($scope, $routeParams, $http, $location) {
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
        $scope.space.openId;

        $scope.findMore = function (path) {
            $location.path(path);
        };

        $scope.getTimestamp = getTimestamp;

        var getKnowledges = function () {
            //alert($scope.space.openId);
            if ($scope.space.openId === undefined) {
                return;
            }
            get_knowledge = url_knowledge + '/userid/' + $scope.space.openId + "/top/5";
            $http.get(get_knowledge).
                    success(function (response)
                    {
                        $scope.space.knowledges = response;
                    })
                    .error(function () {
                        $scope.space.knowledges = [];
                        alert("暂时没有爱点滴，赶快添加哦！");
                    });
        };

        $scope.shareToQQSpace = function (content) {
            shareContentToQQSpace($scope.space.accessToken
                    , $scope.space.openId, content);
        };

        QC.Login.getMe(function (openId, accessToken) {
            $scope.space.openId = openId;
            $scope.space.accessToken = accessToken;
            getKnowledges();
        });

        $scope.$watch('space.openId', getKnowledges);


    }];

var KnowledgeController = ['$scope', '$routeParams', '$http', '$location',
    function ($scope, $routeParams, $http, $location) {

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
        $scope.space.entities;
        $scope.space.entityTitle = '';
        $scope.space.entityContent = '';

        $scope.addEntity = function () {
            if ($scope.space.entityTitle === undefined || $scope.space.entityContent === undefined) {
                return;
            }
            var entity = {"userid": $scope.space.openId, "title": $scope.space.entityTitle, "content": $scope.space.entityContent};
            $http.post(url_knowledge, entity)
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

        $scope.deleteEntity = function (id) {
            if (id === undefined) {
                return;
            }
            var del_url= url_knowledge+'/'+id;
            $http({method:'DELETE',url:del_url})
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

        $scope.getTimestamp = getTimestamp;

        var getEntityList = function () {
            //alert($scope.space.openId);
            if ($scope.space.openId === undefined) {
                return;
            }
            get_knowledge = url_knowledge + '/userid/' + $scope.space.openId;
            $http.get(get_knowledge).
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

//        if ($routeParams.userId !== undefined && $routeParams.userId !== "") {
//            $scope.space.openId = $routeParams.userId;
//            getEntityList();
//        }

        $scope.$watch('space.openId', getEntityList);

        QC.Login.getMe(function (openId, accessToken) {
            $scope.space.openId = openId;
            $scope.space.accessToken = accessToken;
        });


    }];

var BookController = ['$scope', '$routeParams', '$http', '$location',
    function ($scope, $routeParams, $http, $location) {
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

        $scope.getTimestamp = getTimestamp;

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

//        if ($routeParams.userId !== undefined && $routeParams.userId !== "") {
//            $scope.space.openId = $routeParams.userId;
//            getEntityList();
//        }

        $scope.$watch('space.openId', getEntityList);

        QC.Login.getMe(function (openId, accessToken) {
            $scope.space.openId = openId;
            $scope.space.accessToken = accessToken;
        });

    }];
