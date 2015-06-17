angular.module('zmwFactory',['ngResource'])
    .factory('User',['$http','$resource',function($http,$resource){
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
    }])
    .factory('GoodsVar', ['$http','$resource', function($http,$resource){
        var GoodsVar = $resource(config.baseUrl+''+config.woodsVarPath,
            {
            });
        return GoodsVar;
    }])
    .factory('EditGoodsVar', ['$http','$resource', function($http,$resource){
        var EditGoodsVar = $resource(config.baseUrl+''+config.woodsVarPath+'/:id',
            {
                id:'@_id.$oid'
            },{
                update:{
                    method:'PUT',
                    id:'@_id.$oid'
                }
            });
        return EditGoodsVar;
    }])
    .factory('CheckGoodsState',['$resource',function($resource){
        var goodsState = $resource(config.baseUrl+''+config.woodsPath+'/:id'+'/state',
            {
                id:'@_id.$oid',
                state:"SELLING"
            },{
                update:{
                    method:'PUT',
                    id:'@_id.$oid',
                    state:"SELLING"
                }
            });
        return goodsState;
    }]);