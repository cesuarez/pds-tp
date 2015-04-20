angular.module('tripsApp').controller('TripsCtrl', 
    ['$scope', '$stateParams', 'tripsFactory', 'trip', '$location', function(
    $scope, $stateParams, tripsFactory, trip, $location){

    $scope.trip = trip;

    $scope.back = function(){
        $location.url("");
    }

}]);
