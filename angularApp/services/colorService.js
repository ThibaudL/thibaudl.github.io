(function() {
    angular.module('colorServiceModule', [])
        .service('colorService', [ function () {

            var color_service = {
                ctx: {
                    color : null,
                }
            };

            return color_service;
        }]);
})();