var app = angular.module('myApp', ['ngResource', 'ngRoute' ,'ngMaterial',
	'MenuControllerModule',
    'LoginControllerModule',
	'HomeControllerModule',
	'loginServiceModule',
	'repositoryServiceModule',
	'issueServiceModule',
	'labelServiceModule'
]);

app.controller('myAppController', ['$scope','$location','loginService', function($scope,$location, loginService){
	//$scope.$on('$routeChangeStart', function(next, current) {
	//	if(!loginService.ctx.user){
	//		if($location.path() != '/login'){
	//			$location.path('/login');
	//		}
	//	}
	//});
}]);

app.config([ '$routeProvider','$httpProvider', function($routeProvider,$httpProvider) {

	$httpProvider.interceptors.push('APIInterceptor');

	$routeProvider
		.when('/login', {
			templateUrl : 'angularApp/screens/login/template/login.html',
			controller : 'LoginController as login'
		}).when('/home', {
			templateUrl : 'angularApp/screens/home/template/home.html',
			controller : 'HomeController'
		}).otherwise({
			templateUrl : 'angularApp/screens/home/template/home.html',
			controller : 'HomeController'
	});
} ]);

app.config(function($mdThemingProvider) {
	var myRed = $mdThemingProvider.extendPalette('red', {

	});

	var myDeepOrange = $mdThemingProvider.extendPalette('deep-orange', {

	});

	$mdThemingProvider.definePalette('my-red', myRed);
	$mdThemingProvider.definePalette('my-deep-orange', myDeepOrange);

	$mdThemingProvider.theme('default')
		.primaryPalette('my-deep-orange')
		.accentPalette('my-red');


});

app.constant('API_URL','https://api.github.com');


app.service('APIInterceptor', [function() {
	var service = this;

	service.request = function(config) {
		if (localStorage.auth) {
			config.headers.authorization = localStorage.auth;
		}
		return config;
	};

	service.responseError = function(response) {
		return response;
	};
}]);
