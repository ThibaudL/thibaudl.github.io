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
                }
            };

            return issue_service;
        }]);
})();