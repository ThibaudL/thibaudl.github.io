var menuControllerModule = angular.module('MenuControllerModule' ,['ngMaterial', 'loginServiceModule','repositoryServiceModule','issueServiceModule','milestoneServiceModule','logoutServiceModule','labelServiceModule']);

menuControllerModule.controller('MenuController',[ '$scope','$mdSidenav','loginService','logoutService','repositoryService','issueService','milestoneService','labelService',
    function($scope , $mdSidenav, loginService,logoutService,repositoryService,issueService,milestoneService,labelService){
    $scope.title = "Github Project";
    $scope.loginService = loginService;
    $scope.logoutService = logoutService;
    $scope.repositoryService = repositoryService;
    $scope.issueService = issueService;



    $scope.toogleSidenav = function(menuId){
        $mdSidenav(menuId).toggle();
    };

    $scope.loadRepository = function(repository){
        repositoryService.ctx.selected = repository;
        issueService.getIssues();
        milestoneService.getMilestones();
        labelService.getRepositoryLabels(repository);
    };

    $scope.addRepository = function($event){
        if(!$event || $event.which == 13) {
            var owner_repo = $scope.repository.split('/');
            repositoryService.getRepository(owner_repo[0], owner_repo[1])
        }
    };

    $scope.user = {
        username : "",
        password : ""
    };

    $scope.loginService.initIfConnected().then(function(){
        repositoryService.getRepositories();
    });

    $scope.login = function(){
        loginService.login($scope.user).then(function(){
            repositoryService.getRepositories();
            $scope.user = {
                username : "",
                password : ""
            };
        });
    };

}]);
