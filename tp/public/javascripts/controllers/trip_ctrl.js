angular.module('tripsApp').controller('TripsCtrl', 
    ['$scope', '$stateParams', 'tripsFactory', 'trip', '$location', 'auth', function(
    $scope, $stateParams, tripsFactory, trip, $location, auth){

    $scope.isLoggedIn = auth.isLoggedIn();

    $scope.trip = trip;
    $scope.city = {};

    $scope.validCityForm = null;

    $scope.resetCity = function(){
        $scope.city.name = '';
        $scope.city.days = null;
        $scope.validCityForm = null;
    }

    $scope.addCity = function(){
        $scope.validateCityForm();
        if($scope.validCityForm) {
            tripsFactory.addCity($scope.trip, {
                name: $scope.city.name,
                days: $scope.city.days
            });
            $scope.resetCity();
        }
    };

    $scope.validName = function() {
        if (!$scope.city.name){
            $scope.nameErrors = "Ingrese una ciudad";
            return false;
        } else if ($scope.trip.cities.length > 0 &&
        			$scope.trip.cities[$scope.trip.cities.length-1].name == $scope.city.name) {
            $scope.nameErrors = "Ciudad consecutiva repetida";
            return false;
        } else {
            $scope.nameErrors = "";
            return true;
        }
    };

    $scope.validDays = function() {
    	if (!$scope.city.days){
            $scope.daysErrors = "Ingrese una cantidad de dias";
            return false;
        } else if ($scope.city.days != parseInt($scope.city.days)){
            $scope.daysErrors = "Ingrese una número entero";
            return false;
        } else {
            $scope.daysErrors = "";
            return true;
        }
    }


    $scope.validateCityForm = function(){
        $scope.validCityForm = $scope.validName();
        $scope.validCityForm = $scope.validDays() && $scope.validCityForm;

    }

    $scope.back = function(){
        $location.url("/home");
    }

}]);
