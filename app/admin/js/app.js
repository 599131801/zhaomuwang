var routerApp = angular.module('zmwApp',
    ['ui.router', 'ngGrid','angular-oauth2','zmwModules','ZMWFactory']);

var config={
    baseUrl: 'http://192.168.137.1:8080/zhaomuwang',
    clientId: '7b5a38705d7b3562655925406a652e32',
    clientSecret: '655f523128212d6e70634446224c2a48',
    grantPath: '/oauth/token',
    revokePath: '/oauth/revoke',
    usersPath:'/api/users',
    woodsPath:'/api/woods',
    mePath:'/api/me'
};

/**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
routerApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
/**
 * 在认证中添加自己的配置，当前域中的变量config
 */
routerApp.config(['OAuthProvider', function(OAuthProvider){
    OAuthProvider.configure(config);
}]);
/**
 * 配置路由。
 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由。
 * ng原生的路由不能支持嵌套视图，所以这里必须使用ui-router。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
routerApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index");
    $stateProvider
        .state('index',{
            url:'/index',
            views:{
                '':{
                    templateUrl:'partials/login.html',
                    controller:'LoginCotroller'
                }
            }
        })
        .state('home', {
            url: '/home',
            views: {
                '': {
                    templateUrl: 'partials/home.html'
                },
                'topbar@home':{
                    templateUrl:'partials/topbar.html'
                },
                'main@home':{
                    templateUrl:'partials/main.html'
                },
                'goods@home':{
                    templateUrl:'partials/contentTable.html',
                    controller:'GoodsController'
                }
            }
        }).
        state('goods',{
            url: '/goods',
            views: {

            }
        }).
        state('home.usermng',{
            url:'/usermng',
            views:{
                'main@home':{
                    templateUrl:'partials/usermng.html'
                }
            }
        }).
        state('home.usermng.admin',{
            url:'/admin',
            templateUrl:'partials/contentTable.html',
            controller:'UnuseController'
        }).
        state('home.usermng.vip',{
            url:'/vip',
            templateUrl:'partials/contentTable.html',
            controller:'UnuseController'
        }).
        state('home.usermng.normal',{
            url:'/normal',
            templateUrl:'partials/contentTable.html',
            controller:'ContentCtrl'
        }).
        state('home.usermng.black',{
            url:'/black',
            templateUrl:'partials/contentTable.html',
            controller:'UnuseController'
        }).
        state('home.permission',{
            url:'permission',
            views:{
                'main@home':{
                    template:'权限管理'}
            }
        }).
        state('home.report',{
            url:'report',
            views:{
                'main@home':{
                    template:'系统报表'
                }
            }
        }).
        state('home.settings',{
            url:'settings',
            views:{
                'main@home':{
                    template:'系统设置'
                }
            }
        }).
        state('userdetail', {
            url: '/userdetail/:userId', //在路由中传参数的方式
            templateUrl: 'partials/userDetail.html',
            controller:'UserDetailCtrl'
        }).
        state('goodsDetail', {
            url: '/goodsDetail/:goodsId', //在路由中传参数的方式
            templateUrl: 'partials/goodsDetail.html',
            controller:'GoodsDetailController'
        })
});


