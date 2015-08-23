(function() {
    angular.module('loginServiceModule', [])
        .service('loginService', ['$http','$q', '$location','API_URL',
            function ($http,$q, $location,API_URL) {

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