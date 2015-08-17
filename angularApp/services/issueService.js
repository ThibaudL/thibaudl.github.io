(function() {
    angular.module('issueServiceModule', ['repositoryServiceModule'])
        .service('issueService', ['$http', '$q', 'API_URL', '$location','repositoryService', function ($http, $q, API_URL, $location,repositoryService) {

            var issue_service = {
                ctx: {
                    issues : [],
                    selected : null
                },
                getIssues: function () {
                    var deferred = $q.defer();
                    $http.get(API_URL + '/repos/'+repositoryService.ctx.selected.owner.login+'/'+repositoryService.ctx.selected.name+'/issues',{'state' : 'all'})
                        .success(function (data, status) {
                                issue_service.ctx.issues = data;
                                deferred.resolve(data);
                        }).error(function (data) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                },updateIssue : function(issue){
                    var number = issue.number;
                    var deferred = $q.defer();
                    $http.patch(API_URL + '/repos/'+repositoryService.ctx.selected.owner.login+'/'+repositoryService.ctx.selected.name+'/issues/'+number,{
                        "title": issue.title,
                        "body": issue.body,
                        "assignee": (issue.assignee ? issue.assignee.login : null),
                        "milestone": issue.milestone.number,
                        "state": issue.state,
                        "labels": issue.labels
                        }).success(function (data, status) {
                            var index = issue_service.ctx.issues.indexOf(issue);
                            issue_service.ctx.issues[index] = data;
                        }).error(function (data) {
                            deferred.reject(data);
                        });
                    return deferred.promise;


                }
            };

            return issue_service;
        }]);
})();