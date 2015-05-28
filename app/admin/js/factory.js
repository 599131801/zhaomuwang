angular.module('ZMWFactory',['ngResource']).
    factory('User',['$http','$resource',function($http,$resource){
        var Users = $resource(config.baseUrl+''+config.usersPath+'/:id',
            {
                id:'@_id.$oid'
            });
        return Users;
    }])
    .factory('Goods', ['$http','$resource', function($http,$resource){
        var Goods = $resource(config.baseUrl+''+config.woodsPath+'/:id',
            {
                id:'@_id.$oid'
            });
        return Goods;
    }])
    .factory('Me',['$resource',function($resource){
        var Me = $resource(config.baseUrl+''+config.mePath,
            {
            });
        return Me;
    }]);