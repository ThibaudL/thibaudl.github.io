(function() {
    angular.module('commentServiceModule', ['repositoryServiceModule','issueServiceModule'])
        .service('commentService', ['$http', '$q', 'API_URL', '$location','repositoryService','issueService', function ($http, $q, API_URL, $location,repositoryService,issueService) {

            var comment_service = {
                ctx: {
                    comments : [],
                    selected : null
                },
                getComments: function () {
                    var deferred = $q.defer();
                    $http.get(API_URL + '/repos/'+repositoryService.ctx.selected.owner.login+'/'+repositoryService.ctx.selected.name+'/issues/'+issueService.ctx.selected.number+'/comments')
                        .success(function (data, status) {
                                comment_service.ctx.comments = data;
                                deferred.resolve(data);
                        }).error(function (data) {
                            deferred.reject(data);
                        });
                    return deferred.promise;
                },updateComment : function(comment){
                    var number = comment.number;
                    var deferred = $q.defer();
                    $http.patch(API_URL + '/repos/'+repositoryService.ctx.selected.owner.login+'/'+repositoryService.ctx.selected.name+'/comments/'+number,{
                        "title": comment.title,
                        "body": comment.body,
                        "assignee": (comment.assignee ? comment.assignee.login : null),
                        "milestone": comment.milestone.number,
                        "state": comment.state,
                        "labels": comment.labels
                        }).success(function (data, status) {
                            var index = comment_service.ctx.comments.indexOf(comment);
                            comment_service.ctx.comments[index] = data;
                            deferred.resolve(data);
                    }).error(function (data) {
                            deferred.reject(data);
                        });
                    return deferred.promise;


                }
            };

            return comment_service;
        }]);
})();