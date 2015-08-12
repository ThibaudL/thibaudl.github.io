(function() {
    angular.module('repositoryServiceModule', [])
        .service('repositoryService', ['$http', '$q', 'API_URL', '$location', function ($http, $q, API_URL, $location) {

            var repository_service = {
                ctx: {
                    repositories : [],
                    selected : null
                },
                getRepositories: function () {
                    var deferred = $q.defer();
                    $http.get(API_URL + '/user/repos')
                        .success(function (data, status) {
                                repository_service.ctx.repositories = data;
                                deferred.resolve(data);
                        }).error(function (data) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                },
                getRepository: function (owner, repo) {
                    var deferred = $q.defer();
                    $http.get(API_URL + '/repos/'+owner+'/'+repo)
                        .success(function (data, status) {
                            repository_service.ctx.repositories.push(data);
                            deferred.resolve(data);
                        }).error(function (data) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                }
            };

            return repository_service;
        }]);
})();