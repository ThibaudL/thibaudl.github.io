angular.module('calendar.services', ['ngResource'])
    .service('EventService', ['$http',function($http){

        return function(){
                this.$http = $http;
                this.url = 'http://localhost:3000/calendar/';

            
            this.getAll = function() {
                return this.$http.get(this.url+'events').then(function(response){
                    return response.data;
                    });
            };
            
            this.addEvent = function(event) {
                return this.$http.put(this.url+'events', event);
            };
        }
        }]
    );
