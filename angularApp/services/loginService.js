(function() {
    angular.module('loginServiceModule', ['repositoryServiceModule','issueServiceModule','milestoneServiceModule','labelServiceModule'])
        .service('loginService', ['$http', '$q', 'API_URL', '$location','repositoryService','milestoneService','issueService','labelService',
            function ($http, $q, API_URL, $location,repositoryService,milestoneService,issueService,labelService) {

            var login_service = {
                ctx: {
                    user: null,
                },
                login: function (user) {
                    var deferred = $q.defer();
                    var auth = "Basic " + btoa(user.username + ':' + user.password);
                    $http.defaults.headers.common.Authorization = auth;
                    $http.get(API_URL + '/authorizations')
                        .success(function (data, status) {
                            if (status == 200) {
                                login_service.ctx.user = user;
                                localStorage.auth = auth;
                                localStorage.username = user.username;
                                $location.path('/home');
                                deferred.resolve(data);
                            } else {
                                deferred.reject(data);
                                login_service.ctx.error = "Login/Password incorrect.";
                            }
                        }).error(function (data) {
                            deferred.reject(data);
                            login_service.ctx.error = "Login/Password incorrect.";
                        });
                    return deferred.promise;
                },
                logout : function(){
                    delete localStorage.auth;
                    delete localStorage.username;
                    delete login_service.ctx.user;
                    repositoryService.ctx.repositories = [];
                    repositoryService.ctx.selected = null;
                    issueService.ctx.issues = [];
                    issueService.ctx.selected = null;
                    milestoneService.ctx.milestones = [];
                    milestoneService.ctx.selected = null;
                    labelService.ctx.labels = [];
                    labelService.ctx.selected = null;
                },
                initIfConnected : function(){
                    var deferred = $q.defer();
                    if(localStorage.auth && localStorage.username){
                        login_service.ctx.user = {username : localStorage.username};
                        $location.path('/home');
                        deferred.resolve();
                    }else{
                        deferred.reject();
                    }
                    return deferred.promise;

                }
            };

            return login_service;
        }]);
})();