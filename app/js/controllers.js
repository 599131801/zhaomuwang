'use strict';

/* Controllers */

/**
*  Module
*
* Description
*/
angular.module('Controllers', []).
controller('HomeCtrl', ['$scope', function($scope){
	$('.carousel').carousel({
	  interval: 2000
	});

	// $scope.myInterval = 2000;
	// var slides = $scope.slides = [];
	// // var newWidth = 600 + slides.length + 1;
	// slides.push({
	//   image: 'img/c1.jpg',
	//   text: ''
	// });
	// slides.push({
	//   image: 'img/c1.jpg',
	//   text: ''
	// });
}]).
// controller('CarouselCtrl', ['$scope', function($scope){
// 	$scope.myInterval = 2000;
// 	var slides = $scope.slides = [];
// 	var newWidth = 600 + slides.length + 1;
// 	slides.push({
// 	  image: 'img/c1.jpg',
// 	  text: ''
// 	});
// 	slides.push({
// 	  image: 'img/c1.jpg',
// 	  text: ''
// 	});
// }]).
controller('LoginCtrl', ['$scope','OAuth','$rootScope', function($scope,OAuth,$rootScope){
	$scope.hasError = false;
	$rootScope.$on('oauth:error', function(event, rejection) {
       $scope.hasError = true;
		$scope.errorMsg = "手机号和密码不匹配";
    });

    $rootScope.$on('oauth:success', function(event, rejection) {
       
    });
	$scope.login = function() {
		var user = $scope.user;
		var response = OAuth.getAccessToken(user, null);
		if(OAuth.isAuthenticated()) {
		}
	}
}]).
controller('RegisterCtrl', ['$scope','$rootScope','Users', function($scope,$rootScope,Users){

	$scope.step = 1;

	$scope.register = function() {
		Users.save($scope.creatUserRequest,function(resource){
			console.log(resource);
			if(resource.errorCode != null) {
				alert(resource.applicationMessage);
			} else {
				var apiUser = resource.apiUser;
				var oauth2AccessToken = resource.oauth2AccessToken;
				$rootScope.currentUser = apiUser;
				console.log(apiUser);
				console.log(oauth2AccessToken);
				$scope.step = 2;
			}
		});
	}

	$scope.update = function() {
		Users.update({
			id:$rootScope.currentUser.id
		},$scope.user,function(response){
			if(response.errorCode != null) {
				alert(response.errorCode);
			} else {
				var apiUser = response;
				console.log(apiUser);
				$scope.step = 3;
			}
		},function(response){

		});
	}
	
}]).
controller('NavCtrl', ['$scope', function($scope){
	$(".navbar-nav>li>a").click(function(event) {
		/* Act on the event */
		$(this).parent("li").tab('show');
	});
}]);


//Users.query({
//	pageSize:'',
//	pageIndex:'',
//	searchText:(option)
//},function(response){},function(){});
//
//Users.update({
//	id:'',
//},updateRequest,function(){},function(){});
//
//Users.get({
//	id:''
//},function(response){},function(){})