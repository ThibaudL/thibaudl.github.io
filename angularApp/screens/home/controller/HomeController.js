var homeControllerModule = angular.module('HomeControllerModule' ,['ngDraggable','repositoryServiceModule','issueServiceModule','milestoneServiceModule','ngSanitize','markdownServiceModule','commentServiceModule','ngMaterial','labelServiceModule','loginServiceModule']);



homeControllerModule.controller('HomeController',[ '$filter','$scope','$q','repositoryService','issueService','milestoneService','$mdDialog','$sce','markdownService','commentService','labelService','loginService',
    function($filter,$scope,$q,repositoryService,issueService,milestoneService,$mdDialog,$sce,markdownService,commentService,labelService,loginService ){

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

    $scope.newIssue = function($event,milestone){
        issueService.ctx.selected = {
            milestone : milestone,
            labels : []
        };

        $mdDialog.show({
            templateUrl: 'angularApp/screens/issue/template/issue.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            controller : IssueController,
            controllerAs : 'issueCtrl',
            clickOutsideToClose:true
        })
            .then(function(answer) {
            }, function() {
            });
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
        }, function() {
        });


    };

    $scope.checked = function(){
      console.log("checked");
    };

    function IssueController($scope, $mdDialog){

        this.issueService = issueService;
        this.repositoryService = repositoryService;
        this.commentService = commentService;
        this.labelService = labelService;
        this.editMode = issueService.ctx.selected.id ? false : true;
        this.showComments = false;
        this.searchText = '';
        this.selectedIem = null;

        this.answer = function(result){
            $mdDialog.cancel();
        };

        this.querySearch = function(query) {
            return $filter('filter')(this.labelService.ctx.labels, {name : query});
        };

        this.selectItem = function(){
            console.log(this.selectedItem);
            if(this.issueService.ctx.selected.labels.indexOf(this.selectedItem) <0)
                this.issueService.ctx.selected.labels.push(this.selectedItem);
            var labels = [];
            angular.forEach(this.issueService.ctx.selected.labels, function(label){
                if(labels.indexOf(label) <0)
                    labels.push(label);
            });
            this.issueService.ctx.selected.labels = labels;

        };

        this.updateIssue = function(){
            if(issueService.ctx.selected.id) {
                this.issueService.updateIssue(this.issueService.ctx.selected).then(function (issue) {
                    issueService.ctx.selected = issue;
                    issueService.formatIssues();
                    return markdownService.markdownToHtml(issue.body);
                }).then(function (data) {
                    issueService.ctx.selected.htmlBody = repositoryService.ctx.selected.permissions.push ? $sce.trustAsHtml(data.replace(/disabled/gi)) : $sce.trustAsHtml(data);
                });
            }else {
                this.issueService.createIssue(this.issueService.ctx.selected).then(function (issue) {
                    issueService.formatIssues();
                    return markdownService.markdownToHtml(issue.body);
                }).then(function (data) {
                    issueService.ctx.selected.htmlBody = repositoryService.ctx.selected.permissions.push ? $sce.trustAsHtml(data.replace(/disabled/gi)) : $sce.trustAsHtml(data);
                });
            }
        };


    };

}]);

