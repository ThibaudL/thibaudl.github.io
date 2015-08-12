(function() {
    angular.module('milestoneServiceModule', ['repositoryServiceModule','labelServiceModule'])
        .service('milestoneService', ['$http', '$q', 'API_URL', '$location','repositoryService','labelService', function ($http, $q, API_URL, $location,repositoryService,labelService) {

            var milestone_service = {
                ctx: {
                    milestones : [],
                    selected : null
                },
                getMilestones: function () {
                    var deferred = $q.defer();
                    $http.get(API_URL + '/repos/'+repositoryService.ctx.selected.owner.login+'/'+repositoryService.ctx.selected.name+'/milestones')
                        .success(function (data, status) {
                            milestone_service.ctx.milestones = data;
                            angular.forEach(milestone_service.ctx.milestones,function(milestone){
                                labelService.getLabels(milestone).then(function(labels){
                                    milestone.labels = labels;
                                });
                            });
                            deferred.resolve(data);
                        }).error(function (data) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                }
            };

            return milestone_service;
        }]);
})();