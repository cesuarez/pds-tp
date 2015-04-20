angular.module('tripsApp').controller('HomeCtrl', ['$scope', 'tripsFactory', function($scope, tripsFactory){

    $scope.trips = tripsFactory.trips;

    $scope.addTrip = function(){
        if($scope.name !== '' && $scope.name !== undefined) {
            tripsFactory.create({
                name: $scope.name,
                initDate: new Date(), //$scope.initDate,
                endDate: new Date() // $scope.endDate
            });
            $scope.name = '';
            $scope.initDate = null;
            $scope.endDate = null;
        }
    };

}]);