angular.module('Factory', ['ngResource'])
    .factory('Users', ['$http','$resource', function($http,$resource){
      var Users = $resource(config.baseUrl+''+config.usersPath+'/:id', {id:'@_id.$oid'}, {
        update: {method:'PUT',isArray:false}
      });
     return Users;
  }])
