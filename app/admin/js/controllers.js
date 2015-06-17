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
            $scope.hasError=false;
            var user=$scope.user;
            loading();
            OAuth.getAccessToken(user,null)
        }
        $rootScope.$on('oauth:success',function(event, rejection){
            Me.get(null,function(resource){
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
    .controller('GoodsController',['$scope', '$http', '$state', '$stateParams','Goods','GoodsVar','CheckGoodsState',
        function($scope, $http, $state, $stateParams,Goods,GoodsVar,CheckGoodsState){

        this.getGoodsTypeData=function(){
            setTimeout(function() {
                GoodsVar.query({structure:false},function(resource){
                    $scope.varieties =resource;
                    //console.log($scope.goodsTypeData[0]);
                },function(resource){
                    });
            }, 100);
        }
        //初始化
        this.getGoodsTypeData.call(this);
        $scope.firstGoodTypeChange=function(id){
                //$scope.goodTypeId=id;
            $scope.pagingOptions.varietyId=id;
            $scope.goodsTypeData.second=false;
            $scope.goodsTypeData.third=false;
        }
        $scope.secondGoodTypeChange=function(id){
            $scope.goodsTypeData.third=false
            $scope.pagingOptions.varietyId=id;
        }
        $scope.thirdGoodTypeChange=function(id){
            $scope.pagingOptions.varietyId=id;
        }
        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [10, 15, 30,50],
            pageSize: 15,
            currentPage: 1,
            varietyId:""
        };
        $scope.setPagingData = function(resource) {
            //var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.goods = resource.data;
            //console.log($scope.goods)
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
                if($scope.pagingOptions.varietyId!==null&&$scope.pagingOptions.varietyId.length>0){
                    param.varietyId=$scope.pagingOptions.varietyId;
                }
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
            if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage||newVal.pageSize!==oldVal.pageSize||oldVal.varietyId!==newVal.varietyId)) {
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
                field: 'variety.name',
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
                field: 'state',
                displayName: '当前状态',
                enableCellEdit: false,
                sortable: true,
                cellFilter: 'goodsStateFilter',
                width: 120
            },{
                field: 'id',
                displayName: '操作',
                enableCellEdit: false,
                sortable: false,
                pinnable: false,
                cellTemplate: '<div><a ui-sref="goodsDetail({goodsId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
            },{
                field: 'id',
                displayName: '审核',
                enableCellEdit: false,
                sortable: false,
                pinnable: false,
                cellTemplate: '<div><a data-toggle="modal" data-target="#exampleModal" ng-show="showCheck(row.getProperty(col.field))" ' +
                'ng-click="checkGoodsState(row.getProperty(col.field))" id="{{row.getProperty(col.field)}}">通过</a></div>'
            }],
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions
        };

            //点击确定事件
            $scope.saveClick=function(id){
                //模态框消失
                $('#exampleModal').modal('toggle');
                CheckGoodsState.update(
                    {id:id},
                    {id:id,state:'SELLING'},
                    function(resource){
                        if(resource.errorCode){
                            var result=confirm("审核出错");
                            if(result){
                                $scope.saveClick($scope.checkedItemId);
                            }
                        }else{
                            $scope.getPagedDataAsync($scope.pagingOptions.pageSize,
                                $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                        }
                    },
                    function(resource){
                        //alert();
                        console(resource);
                    });
            }

            $scope.checkGoodsState=function(id){
                //console.log(id);
                $scope.checkedItemId=id;
                angular.forEach($scope.goods,function(obj){
                    if(id===obj.id){
                        $scope.checkedItem=obj;
                    }
                })
            }
            $scope.showCheck=function(id){
                state="";
                angular.forEach($scope.goods,function(obj){
                    if(id===obj.id){
                        state=obj.state;
                    }
                })
                if(state==='WAIT_VERIFY'){
                    return true;
                }else{
                    return false;
                }
            }
    }])
    .filter('goodsStateFilter',function(){
        return function(state){
            if(state==='WAIT_VERIFY'){
                return '等待审核';
            }if(state==='SELLING'){
                return '正在出售';
            }if(state==='SELL_OFF'){
                return '售罄'
            }if(state==='NOT_APPROVE'){
                return '审核未通过';
            }
        }
    })
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
        }])

    .controller('GoodsVarController',['$scope','GoodsVar','EditGoodsVar',function($scope,GoodsVar,EditGoodsVar){

        //用于保存获取的商品种类的列表副本
        $scope.copyItems={};
        $scope.getGoodsTypeData=function(){
            setTimeout(function() {
                GoodsVar.query({structure:false},function(resource){
                    //用于保存商品信息的列表
                    $scope.Items=resource;
                },function(resource){
                });
            }, 100);
        }
        //初始化
        $scope.getGoodsTypeData();

        /*$scope.Items=[
            {
                'name':'Parent1',
                'childs':[
                    {'name':'child1'},
                    {'name':'child2'},
                    {'name':'child3'},
                ]
            },
            {
                'name':'Parent2',
                'childs':[
                ]
            },
            {
                'name':'Parent3'
            },
            {
                'name':'Parent4',
                'childs':[
                    {
                        'name':'child1',
                        'childs':[
                            {'name':'child1'},
                            {'name':'child2'},
                            {'name':'child3'},
                            {'name':'child1'},
                            {'name':'child2'},
                            {'name':'child3'},
                            {'name':'child1'},
                            {'name':'child2'},
                            {'name':'child3'},
                            {'name':'child1'},
                            {'name':'child2'},
                            {'name':'child3'},
                        ]

                    },
                    {'name':'child2'},
                    {'name':'child3'},
                ]
            },
            {
                'name':'Parent5'
            },
        ];*/

        $scope.$watch('Items',function(newObj,oldObj) {

        },true);
        $scope.firstGoodTypeChange=function(selectedItemParent){
            //console.log("选择："+selectedItemParent);
            $scope.selectedItemParent=selectedItemParent;
            $scope.goodsTypeData.second=false;
        }
        $scope.secondGoodTypeChange=function(selectedItemParent){
            $scope.selectedItemParent=selectedItemParent;
            //console.log(selectedItemParent.name)
        }

        //改变树形结构层次
        $scope.changTreeStructure=function(selectedItem){
            $('#changeTreeStructure').modal('toggle');
            //console.log(selectedItem.name);
            var selectedItemParentId=null;
            if($scope.selectedItemParent==null){
                selectedItemParentId=null;
            }else{
                selectedItemParentId=$scope.selectedItemParent.id
            }
            EditGoodsVar.update({
                    id:selectedItem.id
                },
                {
                    id:selectedItem.id,
                    parentId:selectedItemParentId,
                    name:selectedItem.name
                },
                function(resource){
                    $scope.getGoodsTypeData();
                },function(resource){
                    console.log(resource);
                });
        };

        //在选中的当前级别中添加新的种类
        $scope.addNewGoodType=function(selectedItem,name){
            $('#addNewGoodType').modal('toggle');
            EditGoodsVar.save(
                {
                    parentId:$scope.selectedItem.parentId,
                    name:name
                },
                function(resource){
                    if(resource.errorCode){
                        var result=confirm("添加失败,请重新提交");
                        if(result){
                            $scope.addNewGoodType(selectedItem,name);
                        }
                    }else{
                        $scope.getGoodsTypeData();
                        //console.log("添加成功");
                    }
                },function(resource){
                    alert("网络出错，请重新尝试");
                });
        }
        //保存确定需要修改的选中项
        $scope.saveEditSelectedItem=function(selectedItem,copySelectedItemName){
            $('#myModal').modal('toggle');
            EditGoodsVar.update({
                    id:selectedItem.id
                },
                {
                    id:selectedItem.id,
                    parentId:selectedItem.parentId,
                    name:copySelectedItemName
                },
                function(resource){
                    $scope.getGoodsTypeData();
                    //console.log("修改成功");
                    console.log(resource);
                },function(resource){
                    //console.log("修改失败");
                    //console.log(resource);
                });
        }
        //将选中的项目删除
        $scope.deleteSelectedItem=function(selectedItem){
            EditGoodsVar.delete(
                {
                    id:selectedItem.id
                },
                function(resource){
                    //console.log("删除成功");
                    $scope.getGoodsTypeData();
                    //console.log(resource);
                },function(resource){
                    //console.log("删除失败");
                    //console.log(resource);
                });
            //console.log(selectedItem.name);
        }
        //点击树形结构，在右侧显示与当前选中相关的层级信息
        $scope.changeData=function(selectedItem){
            $scope.selectedItem=selectedItem;
            $scope.copySelectedItemName=selectedItem.name;
        }
        $scope.editItemName=function(itemName){
            //console.log(itemName);
        }

    }]);


function loading() {
    $('#loader').show();
    $('#loader').fadeOut(2000);
}