angular.module('calendar.home', ['calendar.addevent'])
    .component('calendar', {
        templateUrl: 'app/components/calendar/calendar-template.html',
        controler : ['$log', '$state', 'EventService',function($log, $state, EventService, $ocLazyLoad) {
            var $ctrl = this;
            $ctrl.$log = $log;
            $ctrl.$state = $state;
            $ctrl.calendarView = 'month';
            $ctrl.calendarDate = new Date();
            $ctrl.calendarTitle = 'Elloguard events';
            
            $ctrl.events = [];
            
            EventService.getAll().then(function(allEvents){
                $ctrl.events = allEvents;
            });
        }]
    });
