/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Asc(x, y)
{
    if (x > y)
        return 1;
    if (x < y)
        return -1;
}

function Desc(x, y)
{
    if (x > y)
        return -1;
    if (x < y)
        return 1;
}

var getTimestamp = function () {
    return Math.round(new Date().getTime() / 1000);
};

var getAuthentication = function () {
    var auth = localStorage.getItem("cn.lightshell.recorder.auth");
    if (auth === null || auth === "") {
        auth = {"openId": "", "accessToken": ""};
    } else {
        auth = JSON.parse(auth);
    }
    return auth;
};

var setAuthentication = function (openId, accessToken) {
    var auth = {"openId": openId, "accessToken": accessToken};
    localStorage.setItem("cn.lightshell.recorder.auth", JSON.stringify(auth));
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
            QC.Login.getMe(function (openId, accessToken) {
                setAuthentication(openId, accessToken);
            });
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

        var auth = getAuthentication();
        if (auth.openId === "") {
            QC.Login.getMe(function (openId, accessToken) {
                $scope.space.openId = openId;
                $scope.space.accessToken = accessToken;
            });
        }
        else {
            $scope.space.openId = auth.openId;
            $scope.space.accessToken = auth.accessToken;
            getKnowledges();
        }

        $scope.findMore = function (path) {
            $location.path(path);
        };

        $scope.getTimestamp = getTimestamp;

        $scope.shareToQQSpace = function (content) {
            shareContentToQQSpace($scope.space.accessToken
                    , $scope.space.openId, content);
        };

        $scope.$watch('space.openId', getKnowledges);

    }];

var KnowledgeController = ['$scope', '$routeParams', '$location', 'Knowledge',
    function ($scope, $routeParams, $location, Knowledge) {

        $scope.authorized = false;
        if (!QC.Login.check()) {
            $location.path("/login");
            return;
        } else {
            $scope.authorized = true;
        }

        $scope.space = {};
        $scope.space.knowledges = [];
        $scope.space.entityTitle = '';
        $scope.space.entityContent = '';

        var getEntityList = function () {
            Knowledge.query($scope.space.openId, $scope);
        };

        $scope.getEntityList = getEntityList;

        var auth = getAuthentication();
        if (auth.openId === "") {
            QC.Login.getMe(function (openId, accessToken) {
                $scope.space.openId = openId;
                $scope.space.accessToken = accessToken;
            });
        } else {
            $scope.space.openId = auth.openId;
            $scope.space.accessToken = auth.accessToken;
            getEntityList();
        }

        $scope.addEntity = function () {
            if ($scope.space.entityTitle === undefined || $scope.space.entityContent === undefined) {
                return;
            }
            var entity = {"userid": $scope.space.openId, "title": $scope.space.entityTitle, "content": $scope.space.entityContent};
            Knowledge.add(entity, $scope);
            $scope.space.entityTitle = "";
            $scope.space.entityContent = "";
        };

        $scope.deleteEntity = function (id) {
            if (id === undefined || $scope.space.openId === undefined) {
                return;
            }
            //先从客户端缓存数组中移除
            angular.forEach($scope.space.knowledges, function (item) {
                if (item.id === id) {
                    $scope.space.knowledges.splice($scope.space.knowledges.indexOf(item), 1);
                }
            });
            //持久化到服务器端
            Knowledge.delete($scope.space.openId, id);

        };

        $scope.shareToQQSpace = function (content) {
            shareContentToQQSpace($scope.space.accessToken
                    , $scope.space.openId, content);
        };

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
