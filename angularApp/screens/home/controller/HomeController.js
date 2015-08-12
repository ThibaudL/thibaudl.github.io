var homeControllerModule = angular.module('HomeControllerModule' ,['repositoryServiceModule','issueServiceModule','milestoneServiceModule']);

homeControllerModule.controller('HomeController',[ '$scope','repositoryService','issueService','milestoneService', function($scope,repositoryService,issueService,milestoneService ){

    $scope.repositoryService = repositoryService;
    $scope.issueService = issueService;
    $scope.milestoneService = milestoneService;

    $scope.$watch('issueService.ctx.issues.length', function(){
        issueService.ctx.issues.length = issueService.ctx.issues.length ? issueService.ctx.issues.length : 0;
        $scope.progressValue = issueService.ctx.issues.length > 0 ?  ((issueService.ctx.issues.length - repositoryService.ctx.selected.open_issues) / issueService.ctx.issues.length)*100 : 100;
    },true);

}]);
