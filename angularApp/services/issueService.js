(function() {
    angular.module('issueServiceModule', ['repositoryServiceModule','loginServiceModule'])
        .service('issueService', ['$http', '$q', 'API_URL', '$location','repositoryService','loginService', function ($http, $q, API_URL, $location,repositoryService,loginService) {

            var issue_service = {
                ctx: {
                    issues : [],
                    selected : null
                },
                getIssues: function () {
                    var deferred = $q.defer();
                    $http.get(API_URL + '/repos/'+repositoryService.ctx.selected.owner.login+'/'+repositoryService.ctx.selected.name+'/issues',{params:{state : 'all',sort : 'created'}})
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
                            var index;
                        var i = 0;
                            angular.forEach(issue_service.ctx.issues, function(anIssue){
                                if(anIssue.number == issue.number)
                                    index = i;
                                i++
                            });
                            issue_service.ctx.issues[index] = data;
                            deferred.resolve(data);
                    }).error(function (data) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                },createIssue : function(issue){
                    return $http.post(API_URL + '/repos/'+repositoryService.ctx.selected.owner.login+'/'+repositoryService.ctx.selected.name+'/issues',{
                        "title": issue.title,
                        "body": issue.body,
                        "assignee": (issue.assignee ? issue.assignee.login : null),
                        "milestone": issue.milestone.number,
                        "state": issue.state,
                        "labels": issue.labels
                    }).success(function (data, status) {
                        issue_service.ctx.issues.push(data);
                        issue_service.ctx.selected = data;
                        return data;
                    }).error(function (data) {
                        return data;
                    });
                },
                formatIssues : function(){


                    angular.forEach(issue_service.ctx.issues, function (issue) {
                        var permission = repositoryService.ctx.selected.permissions ? repositoryService.ctx.selected.permissions.push : false;
                        permission = permission || ( loginService.ctx.user ? (issue.user.login == loginService.ctx.user.username) : false);

                        issue.checkboxes = [];
                        var checkboxes = (issue.body.match(/- \[[\s\S]\].*/g) || []);

                        angular.forEach(checkboxes, function (checkbox) {
                            issue.checkboxes.push({
                                initialText: checkbox,
                                text: checkbox.replace(/- \[[\s\S]\]/g, ''),
                                checked: checkbox.match(/- \[x\].*/g) ? true : false,
                                disabled: !permission
                            });
                        });
                    });
                }
            };

            return issue_service;
        }]);
})();