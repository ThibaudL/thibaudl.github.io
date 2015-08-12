(function() {
    angular.module('labelServiceModule', ['repositoryServiceModule'])
        .service('labelService', ['$http', '$q', 'API_URL', '$location','repositoryService', function ($http, $q, API_URL, $location,repositoryService) {

            var label_service = {
                ctx: {
                    labels : [],
                    selected : null
                },
                getLabels: function (milestone) {
                    var deferred = $q.defer();
                    $http.get(milestone.labels_url)
                        .success(function (data, status) {
                                deferred.resolve(data);
                        }).error(function (data) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                }
            };

            return label_service;
        }]);
})();