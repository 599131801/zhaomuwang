/**
 * 这里是整体模块
 * @type {[type]}
 */
var allModules=angular.module('zmwModules',[])
    .controller('ContentCtrl',['$scope', '$http', '$state', '$stateParams','User',
        function($scope, $http, $state, $stateParams,User) {
        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [10, 15, 30],
            pageSize: 15,
            currentPage: 1
        };
        $scope.setPagingData = function(resource) {
            $scope.users = resource.data;
            var begin=$scope.pagingOptions.pageSize*($scope.pagingOptions.currentPage-1)+1;
            if($scope.users!=null)
                for(var i = 0;i < $scope.users.length; i++) {
                    $scope.users[i].index = i+begin;
                }
            $scope.totalServerItems = resource.rowCount;
            //var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            //$scope.users = pagedData;
            //$scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //这里可以根据路由上传递过来的menuType参数加载不同的数据
        $scope.getPagedDataAsync = function(pageSize, page, searchText) {
            setTimeout(function() {
                loading();
                var param={
                    currentPage:($scope.pagingOptions.currentPage-1),
                    pageSize:$scope.pagingOptions.pageSize
                };
                    if (searchText) {
                        var ft = searchText.toLowerCase();
                        param.searchText=ft;
                        User.get(param,function(resource){
                            $scope.setPagingData(resource);
                        },function(resource){
                            alert("查找用户列表出错，请刷新页面");
                        });
                    } else {
                        User.get(param,function(resource){
                            $scope.setPagingData(resource);
                        },function(resource){
                            alert("获取用户列表出错，请刷新页面");
                        });
                }
            }, 100);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function(newVal, oldVal) {
            if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage||newVal.pageSize!==oldVal.pageSize)) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.content='';
        $scope.search=function(){
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.content);
            $scope.content='';
        };
        $scope.gridOptions = {
            data: 'users',
            rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            '<div ng-cell></div>' +
            '</div></div>',
            multiSelect: false,
            enableColumnResize:true,
            enableCellSelection: false,
            enableRowSelection: true,
            enableCellEdit: false,
            enablePinning: false,
            columnDefs: [{
                field: 'index',
                displayName: '序号',
                width: 60,
                pinnable: false,
                sortable: false
            }, {
                field: 'name',
                displayName: '用户名',
                enableCellEdit: false
            }, {
                field: 'gender',
                displayName: '性别',
                sortable:false,
                enableCellEdit: false,
                width: 220
            }, {
                field: 'address',
                displayName: '地址',
                enableCellEdit: false,
                width: 120
            }, {
                field: 'phone',
                displayName: '电话',
                enableCellEdit: false,
                width: 120
            }, {
                field: 'id',
                displayName: '操作',
                enableCellEdit: false,
                sortable: false,
                pinnable: false,
                cellTemplate: '<div><a ui-sref="userdetail({userId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
            }],
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions
        };
    }])
    .controller('UserDetailCtrl',['$scope', '$state', '$stateParams','$filter','User',
    function($scope, $state, $stateParams,$filter,User) {
        var params={id:$stateParams.userId};
        User.get(
            params,
            function(resource){
                $scope.userDetail=resource;
            },
            function(resource){
                alert("查找用户信息出错，请刷新页面");
            });
    }])
    .controller('LoginCotroller',
        ['$scope','$rootScope','$window','OAuth','Me',function($scope,$rootScope,$window,OAuth,Me){
        $scope.login=function(){
            //图片加载显示
            var user=$scope.user;
            loading();
            OAuth.getAccessToken(user,null)
        }
        $rootScope.$on('oauth:success',function(event, rejection){
            Me.get(null,function(resource){
                //console.log(resource);
                if('ROLE_ADMIN'===resource.role){
                    $window.location.href = '#/home'
                }else{
                    $scope.hasError=true;
                    $scope.errorMsg="您没有管理员权限";
                }
            },function(resource){
                $scope.hasError=true;
                $scope.errorMsg="个人信息加载失败";
            });

        });
        $rootScope.$on('oauth:error',function(event, rejection){
           $scope.hasError=true;
            if(rejection.data.error=="invalid_grant"){
                $scope.errorMsg="用户名或密码错误";
            }else if(rejection.data.error=="unauthorized"){
                $scope.errorMsg="您没有管理员权限";
            }else{
                $scope.errorMsg="未知错误";
            }
        })}])
    //.controller('RegisterController',['$scope','$window','LoginFactory',function($scope,$window,LoginFactory){
    //    $scope.users={
    //            user:{
    //                phone:'15606135652'},
    //            password:{
    //                password:'123456'
    //            }};
    //    $scope.registerUser=function(){
    //        LoginFactory.userLogin($scope.users)
    //            .success(function(data,status){
    //                alert(data.errorCode);
    //           console.log(data);
    //                $window.location.href = '#/home'
    //        });
    //};}])
    .controller('GoodsController',['$scope', '$http', '$state', '$stateParams','Goods',
        function($scope, $http, $state, $stateParams,Goods){
        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [10, 15, 30,50],
            pageSize: 15,
            currentPage: 1
        };
        $scope.setPagingData = function(resource) {
            //var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.goods = resource.data;
            var begin=$scope.pagingOptions.pageSize*($scope.pagingOptions.currentPage-1)+1;
            for(var i = 0;i < $scope.goods.length; i++) {
                $scope.goods[i].index = i+begin;
            }
            $scope.totalServerItems = resource.rowCount;
            //$scope.pagingOptions.currentPage=resource.currentPage;
            //$scope.pagingOptions.pageSize=resource.pageSize;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //这里可以根据路由上传递过来的menuType参数加载不同的数据
        $scope.getPagedDataAsync = function(pageSize, page, searchText) {
            setTimeout(function() {
                loading();
                var param={
                    currentPage:($scope.pagingOptions.currentPage-1),
                    pageSize:$scope.pagingOptions.pageSize
                };
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    param.searchText=ft;
                    Goods.get(param,function(resource){
                        $scope.setPagingData(resource);
                    },function(resource){
                        alert("获取商品列表出错");
                    });
                } else {
                    Goods.get(param,function(resource){
                        $scope.setPagingData(resource);
                    },function(resource){
                        alert("获取商品列表出错");
                    });
                }
            }, 100);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function(newVal, oldVal) {
            if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage||newVal.pageSize!==oldVal.pageSize)) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.content='';
        $scope.search=function(){
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.content);
            $scope.content='';
        };
        $scope.gridOptions = {
            data: 'goods',
            rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            '<div ng-cell></div>' +
            '</div></div>',
            multiSelect: false,
            tabIndex:0,
            enableColumnResize:true,
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEdit: false,
            enablePinning: false,
            columnDefs: [{
                field: 'index',
                displayName: '序号',
                width: 60,
                pinnable: false,
                sortable: false
            }, {
                field: 'variety',
                displayName: '品种',
                enableCellEdit: false,
                width:100
            }, {
                field: 'location',
                displayName: '销售地',
                sortable:false,
                enableCellEdit: false,
                width: 220
            },{
                field: 'dimensions',
                displayName: '商品规格',
                enableCellEdit: false,
                sortable: true,
                width: 150
            }, {
                field: 'price',
                displayName: '价格',
                enableCellEdit: false,
                width: 120
            }, {
                field: 'quantity',
                displayName: '库存',
                enableCellEdit: false,
                width: 120
            },{
                field: 'releaseDate',
                displayName: '发布时间',
                enableCellEdit: false,
                sortable: true,
                cellFilter: 'date:"yyyy-mm-dd"',
                width: 120
            }, {
                field: 'id',
                displayName: '操作',
                enableCellEdit: false,
                sortable: false,
                pinnable: false,
                cellTemplate: '<div><a ui-sref="goodsDetail({goodsId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
            }],
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions
        };
    }])
    .controller('GoodsDetailController',['$scope', '$state', '$stateParams','Goods',
        function($scope, $state, $stateParams,Goods) {
            loading();
            var params={id:$stateParams.goodsId};
            Goods.get(
                params,
                function(resource){
                    $scope.goodsDetail=resource;
                },
                function(resource){
                });
    }])
    .controller('UnuseController',['$scope', '$http', '$state', '$stateParams','User',
        function($scope, $http, $state, $stateParams,User) {
            $scope.tip="正在开发中。。。。。。";
            $scope.isDing=true;
        }]);


function loading() {
    $('#loader').show();
    $('#loader').fadeOut(2000);
}