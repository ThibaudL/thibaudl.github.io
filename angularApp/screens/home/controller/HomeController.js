var homeControllerModule = angular.module('HomeControllerModule' ,['ngDraggable','repositoryServiceModule','issueServiceModule','milestoneServiceModule','ngSanitize','markdownServiceModule','commentServiceModule','ngMaterial']);



homeControllerModule.controller('HomeController',[ '$scope','repositoryService','issueService','milestoneService','$mdDialog','$sce','markdownService','commentService',
    function($scope,repositoryService,issueService,milestoneService,$mdDialog,$sce,markdownService,commentService ){

    $scope.repositoryService = repositoryService;
    $scope.issueService = issueService;
    $scope.milestoneService = milestoneService;


    $scope.$watch('issueService.ctx.issues.length', function(length){
        if(length && length>0) {
            issueService.ctx.issues.length = issueService.ctx.issues.length ? issueService.ctx.issues.length : 0;
            $scope.progressValue = issueService.ctx.issues.length > 0 ? ((issueService.ctx.issues.length - repositoryService.ctx.selected.open_issues) / issueService.ctx.issues.length) * 100 : 100;

            issueService.formatIssues();
        }
    },true);

    $scope.clickedCheckbox = function(issue){
        angular.forEach(issue.checkboxes,function(checkbox){
            var text = checkbox.initialText.replace(/- \[[\s\S]\]/g,'- ['+(checkbox.checked ? 'x' : ' ')+']');
            issue.body = issue.body.replace(checkbox.initialText,text);
        });
        issueService.updateIssue(issue).then(function(){
            issueService.formatIssues();
        });

    };

    $scope.onDropComplete = function($data,$event,milestone) {
        if ($data) {
            $data.milestone = milestone;
            issueService.updateIssue($data).then(function(){
                issueService.formatIssues();
            });

        }
    };

    $scope.click = function($event){
        if($event.ctrlKey) {
            console.log("click");
        }
    };

    $scope.showAdvanced = function(ev,issue) {
        issueService.ctx.selected = issue;
        commentService.getComments().then(function(){
            angular.forEach(commentService.ctx.comments,function(comment) {
                markdownService.markdownToHtml(comment.body).then(function (commentHtml) {
                    comment.htmlBody = commentHtml;
                });
            });
        });
        markdownService.markdownToHtml(issue.body).then(function(data){
            var permission = repositoryService.ctx.selected.permissions ? repositoryService.ctx.selected.permissions.push : false;
            permission = permission || ( loginService.ctx.user ? (issue.user.login == loginService.ctx.user.username) : false);
            issueService.ctx.selected.htmlBody = permission ? $sce.trustAsHtml(data.replace(/disabled/gi)) : $sce.trustAsHtml(data);
        });
        $mdDialog.show({
            templateUrl: 'angularApp/screens/issue/template/issue.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            controller : IssueController,
            controllerAs : 'issueCtrl',
            clickOutsideToClose:true
        })
        .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });


    };

    $scope.checked = function(){
      console.log("checked");
    };

    function IssueController($scope, $mdDialog){

        this.issueService = issueService;
        this.repositoryService = repositoryService;
        this.commentService = commentService;
        this.editMode = false;
        this.showComments = false;

        this.answer = function(result){
            $mdDialog.cancel();
        };

        this.updateIssue = function(){
          this.issueService.updateIssue(this.issueService.ctx.selected).then(function(issue){
              issueService.ctx.selected = issue;
              issueService.formatIssues();
              return markdownService.markdownToHtml(issue.body);
          }).then(function(data){
              issueService.ctx.selected.htmlBody = repositoryService.ctx.selected.permissions.push ? $sce.trustAsHtml(data.replace(/disabled/gi)) : $sce.trustAsHtml(data);
          });
        };


    };

}]);

