var app = angular.module('tripsApp', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/templates/home.html',
        controller: 'HomeCtrl',
        resolve: {
            tripPromise: ['tripsFactory', function(tripsFactory){
                return tripsFactory.getAll();
            }]
        }
    })
    
    .state('trip', {
        url: '/trips/{id}',
        templateUrl: '/templates/trip.html',
        controller: 'TripsCtrl',
        resolve: {
            trip: ['$stateParams', 'tripsFactory', function($stateParams, tripsFactory) {
                return tripsFactory.get($stateParams.id);
            }]
        }
        
    });

    $urlRouterProvider.otherwise('home');
}]);

