(function() {
    angular.module('markdownServiceModule', ['repositoryServiceModule'])
        .service('markdownService', ['$http', '$q', 'API_URL','repositoryService', function ($http, $q, API_URL,repositoryService) {

            var markdown_service = {

                markdownToHtml: function (text) {
                    var deferred = $q.defer();
                    $http.post(API_URL + '/markdown',
                        {
                            'text' : text,
                            'mode' : 'gfm',
                            'context' : repositoryService.ctx.selected.owner.login+'/'+repositoryService.ctx.selected.name
                        }
                    )
                    .success(function (data, status) {
                            deferred.resolve(data);
                    }).error(function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                }
            };

            return markdown_service;
        }]);
})();