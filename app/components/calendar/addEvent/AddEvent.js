angular.module('calendar.addevent', [])
    .component('addEvent', {
        templateUrl: 'app/components/calendar/addEvent/add-event-template.html',
        bindings: {
            events: '=',
        },
        controller : ['$log', '$state', 'EventService', function($log, $state, EventService){
            var $ctrl = this;
            
            $ctrl.$log = $log;
            $ctrl.$state = $state;
            $ctrl.EventService = EventService;
            $ctrl.defaultEvent = {
                color: {
                    primary: '#aaaaaa',
                },
                startsAt : new Date(),
                allDay: false,
            };
            $ctrl.event = angular.copy($ctrl.defaultEvent);

            $ctrl.addEvent = function(event) {
                $ctrl.EventService.addEvent(event).then(function() {
                    $ctrl.events.push(event);
                });
            };
        }]
    });
