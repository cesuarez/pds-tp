var app = angular.module('tripsApp', 
    ['ui.router', 'ui.bootstrap.datetimepicker', 'ngMap']
);

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
        },
        onEnter: ['$location', 'auth', function($location , auth){
            if(!auth.isLoggedIn()){
                $location.path('');
            }
        }]
    })
    
    .state('trip', {
        url: '/trips/{id}',
        templateUrl: '/templates/trip.html',
        controller: 'TripsCtrl',
        resolve: {
            trip: ['$stateParams', 'tripsFactory', function($stateParams, tripsFactory) {
                return tripsFactory.get($stateParams.id);
            }]
        },
        onEnter: ['$location', 'auth', function($location , auth){
            if(!auth.isLoggedIn()){
                $location.path('');
            }
        }]
    })

    .state('login', {
        url: '/login',
        templateUrl: '/templates/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
                $state.go('home');
            }
        }]
    })

    .state('register', {
        url: '/register',
        templateUrl: '/templates/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
                $state.go('home');
            }
        }]
    })

    .state('index', {
        url: '/index',
        templateUrl: '/templates/index.html',
        //controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
                $state.go('home');
            }
        }]
    });

   $urlRouterProvider.otherwise('index');
//    $urlRouterProvider.otherwise('home');
}]);

