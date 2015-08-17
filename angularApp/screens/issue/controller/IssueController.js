var issueControllerModule = angular.module('IssueControllerModule' ,['issueServiceModule']);

issueControllerModule.controller('IssueController', [  'issueService', function(issueService){

    this.issueService = issueService;

}]);
