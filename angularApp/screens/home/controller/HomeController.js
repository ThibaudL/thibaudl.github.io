var homeControllerModule = angular.module('HomeControllerModule' ,['ngDraggable','repositoryServiceModule','issueServiceModule','milestoneServiceModule']);

homeControllerModule.controller('HomeController',[ '$scope','repositoryService','issueService','milestoneService','$mdDialog', function($scope,repositoryService,issueService,milestoneService,$mdDialog ){

    $scope.repositoryService = repositoryService;
    $scope.issueService = issueService;
    $scope.milestoneService = milestoneService;

    $scope.$watch('issueService.ctx.issues.length', function(){
        issueService.ctx.issues.length = issueService.ctx.issues.length ? issueService.ctx.issues.length : 0;
        $scope.progressValue = issueService.ctx.issues.length > 0 ?  ((issueService.ctx.issues.length - repositoryService.ctx.selected.open_issues) / issueService.ctx.issues.length)*100 : 100;
    },true);

    $scope.onDropComplete = function($data,$event,milestone){
        $data.milestone = milestone;
        issueService.updateIssue($data);
    };

    $scope.click = function($event){
        if($event.ctrlKey) {
            console.log("click");
        }
    }

    $scope.showAdvanced = function(ev,issue) {
        issueService.ctx.selected = issue;
        $mdDialog.show({
            templateUrl: 'angularApp/screens/issue/template/issue.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

}]);
