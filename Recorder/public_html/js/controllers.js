/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
        }
    }];

var SpaceController = ['$scope', '$routeParams', '$http', '$location', 'Knowledge', 'Book',
    function ($scope, $routeParams, $http, $location, Knowledge, Book) {

        $scope.authorized = false;
        if (!QC.Login.check()) {
            $location.path("/login");
            return;
        } else {
            $scope.authorized = true;
        }

        $scope.space = {};
        $scope.space.knowledges;
        $scope.space.books;

        var getKnowledges = function () {
            //alert($scope.space.openId);
            Knowledge.top($scope.space.openId, $scope);
        };

        var getBooks = function () {
            //alert($scope.space.openId);
            Book.top($scope.space.openId, $scope);
        };

        $scope.findMore = function (path) {
            $location.path(path);
        };

        $scope.getTimestamp = getTimestamp;

        $scope.shareToQQSpace = function (content) {
            shareContentToQQSpace($scope.space.accessToken
                    , $scope.space.openId, content);
        };

        var auth = getAuthentication();
        if (auth.openId === "") {
            QC.Login.getMe(function (openId, accessToken) {
                $scope.space.openId = openId;
                $scope.space.accessToken = accessToken;
                setAuthentication(openId, accessToken);
            });
        } else {
            $scope.space.openId = auth.openId;
            $scope.space.accessToken = auth.accessToken;
        }

        $scope.$watch('space.openId', getKnowledges);
        $scope.$watch('space.openId', getBooks);

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
        $scope.space.editEntity;

        var getEntityData = function () {
            Knowledge.query($scope.space.openId, $scope);
        };

        $scope.getEntityData = getEntityData;

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
            //持久化到服务器端
            Knowledge.del($scope.space.openId, id, $scope);
        };

        $scope.editEntity = function (entity) {
            if (entity === undefined) {
                return;
            }
            $scope.space.editEntity = entity;
        };

        $scope.saveEntity = function () {
            if ($scope.space.editEntity === undefined) {
                return;
            }
            Knowledge.save($scope.space.openId, $scope.space.editEntity.id, $scope.space.editEntity, $scope)
        };

        $scope.shareToQQSpace = function (content) {
            shareContentToQQSpace($scope.space.accessToken
                    , $scope.space.openId, content);
        };

        $scope.hideEditModal = function () {
            $("#editModal").modal('hide');
        };

        var auth = getAuthentication();
        if (auth.openId === "") {
            QC.Login.getMe(function (openId, accessToken) {
                $scope.space.openId = openId;
                $scope.space.accessToken = accessToken;
                setAuthentication(openId, accessToken);
            });
        } else {
            $scope.space.openId = auth.openId;
            $scope.space.accessToken = auth.accessToken;
        }

        $scope.$watch('space.openId', getEntityData);
//        $scope.space.openId = "B7D8B5B9CFF54C9757134B0451243003";

    }];

var BookController = ['$scope', '$routeParams', '$http', '$location', 'Book',
    function ($scope, $routeParams, $http, $location, Book) {

        $scope.authorized = false;
        if (!QC.Login.check()) {
//            $location.path("/login");
//            return;
        } else {
            $scope.authorized = true;
        }

        $scope.space = {};
        $scope.space.books = [];
        $scope.space.entityName = '';
        $scope.space.entityAuthor = '';
        $scope.space.entityCatelog = '';
        $scope.space.entityISBN = '';
        $scope.space.entityEvaluate = '';
        $scope.space.editEntity;

        var getEntityData = function () {
            //alert($scope.space.openId);
            Book.query($scope.space.openId, $scope);
        };

        $scope.getEntityData = getEntityData;

        $scope.addEntity = function () {
            if ($scope.space.entityName === undefined || $scope.space.entityName === "") {
                return;
            }
            var entity = {"userid": $scope.space.openId, "name": $scope.space.entityName,
                "author": $scope.space.entityAuthor, "catelog": $scope.space.entityCatelog,
                "isbn": $scope.space.entityISBN, "evaluate": $scope.space.entityEvaluate};
            Book.add(entity, $scope);
            $scope.space.entityName = "";
            $scope.space.entityAuthor = "";
            $scope.space.entityCatelog = '';
            $scope.space.entityISBN = '';
            $scope.space.entityEvaluate = "";
        };

        $scope.deleteEntity = function (id) {
            if (id === undefined || $scope.space.openId === undefined) {
                return;
            }
            //持久化到服务器端
            Book.del($scope.space.openId, id, $scope);
        };

        $scope.editEntity = function (entity) {
            if (entity === undefined) {
                return;
            }
            $scope.space.editEntity = entity;
        };

        $scope.saveEntity = function () {
            if ($scope.space.editEntity === undefined) {
                return;
            }
            var entity = $scope.space.editEntity;
            Book.save($scope.space.openId, $scope.space.editEntity.id, entity, $scope)
        };

        $scope.shareToQQSpace = function (content) {
            shareContentToQQSpace($scope.space.accessToken
                    , $scope.space.openId, content);
        };

        $scope.hideEditModal = function () {
            $("#editModal").modal('hide');
        };

//        var auth = getAuthentication();
//        if (auth.openId === "") {
//            QC.Login.getMe(function (openId, accessToken) {
//                $scope.space.openId = openId;
//                $scope.space.accessToken = accessToken;
//                setAuthentication(openId, accessToken);
//            });
//        } else {
//            $scope.space.openId = auth.openId;
//            $scope.space.accessToken = auth.accessToken;
//        }

        $scope.$watch('space.openId', getEntityData);
        $scope.space.openId = "B7D8B5B9CFF54C9757134B0451243003";
    }];

var BookDetailController = ['$scope', '$routeParams', '$http', '$location', 'Book',
    function ($scope, $routeParams, $http, $location, Book) {

        $scope.authorized = false;
        if (!QC.Login.check()) {
//            $location.path("/login");
//            return;
        } else {
            $scope.authorized = true;
        }

        $scope.space = {};
        $scope.space.book ;
        $scope.space.entityName = '';
        $scope.space.entityAuthor = '';
        $scope.space.entityCatelog = '';
        $scope.space.entityISBN = '';
        $scope.space.entityEvaluate = '';
        $scope.space.editEntity;

        var getEntityData = function () {
            //alert($scope.space.openId);
            Book.get($scope.space.openId, $routeParams.bookId, $scope);
        };

        $scope.getEntityData = getEntityData;

        $scope.editEntity = function (entity) {
            if (entity === undefined) {
                return;
            }
            $scope.space.editEntity = entity;
        };

        $scope.saveEntity = function () {
            if ($scope.space.editEntity === undefined) {
                return;
            }
            var entity = $scope.space.editEntity;
            Book.save($scope.space.openId, $scope.space.editEntity.id, entity, $scope)
        };

        $scope.shareToQQSpace = function (content) {
            shareContentToQQSpace($scope.space.accessToken
                    , $scope.space.openId, content);
        };

        $scope.hideEditModal = function () {
            $("#editModal").modal('hide');
        };

//        var auth = getAuthentication();
//        if (auth.openId === "") {
//            QC.Login.getMe(function (openId, accessToken) {
//                $scope.space.openId = openId;
//                $scope.space.accessToken = accessToken;
//                setAuthentication(openId, accessToken);
//            });
//        } else {
//            $scope.space.openId = auth.openId;
//            $scope.space.accessToken = auth.accessToken;
//        }

        $scope.$watch('space.openId', getEntityData);
        $scope.space.openId = "B7D8B5B9CFF54C9757134B0451243003";
    }];
