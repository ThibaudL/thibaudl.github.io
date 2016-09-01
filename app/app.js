angular.module('calendar', ['ngAnimate', 'ngSanitize', 'ngMessageFormat', 'ui.router',
              'calendar.menu', 'calendar.home', 'calendar.services', 'mwl.calendar', 'colorpicker.module'])
.config(['$locationProvider','$stateProvider',function($locationProvider,$stateProvider){
  $stateProvider
  .state('calendar', {
    url: '/',
    template: '<calendar></calendar>',
  });
  // use the HTML5 History API
  // $locationProvider.html5Mode(true);  
}]);
