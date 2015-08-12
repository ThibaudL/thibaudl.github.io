var loginControllerModule = angular.module('LoginControllerModule' ,['loginServiceModule','repositoryServiceModule']);

loginControllerModule.controller('LoginController', [  'loginService','repositoryService', function(loginService,repositoryService){

    this.user = {
        username : "",
        password : ""
    };

    this.loginService = loginService;
    this.loginService.initIfConnected().then(function(){
        repositoryService.getRepositories();
    });

    this.login = function(user){
      loginService.login(user).then(function(){
          repositoryService.getRepositories();
      });
    };

}]);
