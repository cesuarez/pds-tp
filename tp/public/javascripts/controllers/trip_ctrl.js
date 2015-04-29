angular.module('tripsApp').controller('TripsCtrl', 
    ['$scope', '$stateParams', 'tripsFactory', 'trip', '$location', 'auth', function(
    $scope, $stateParams, tripsFactory, trip, $location, auth){

    $scope.isLoggedIn = auth.isLoggedIn();

    $scope.trip = trip;

    $scope.back = function(){
        $location.url("");
    }

}]);
