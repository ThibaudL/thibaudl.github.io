(function() {
    angular.module('logoutServiceModule', ['repositoryServiceModule','issueServiceModule','milestoneServiceModule','labelServiceModule','loginServiceModule'])
        .service('logoutService', ['repositoryService','milestoneService','issueService','labelService','loginService',
            function (repositoryService,milestoneService,issueService,labelService,loginService) {

            var logout_service = {
                logout : function(){
                    delete localStorage.auth;
                    delete localStorage.username;
                    delete loginService.ctx.user;
                    repositoryService.ctx.repositories = [];
                    repositoryService.ctx.selected = null;
                    issueService.ctx.issues = [];
                    issueService.ctx.selected = null;
                    milestoneService.ctx.milestones = [];
                    milestoneService.ctx.selected = null;
                    labelService.ctx.labels = [];
                    labelService.ctx.selected = null;
                }
            };

            return logout_service;
        }]);
})();