angular.module('tripsApp').controller('TripsCtrl', 
    ['$scope', '$stateParams', 'tripsFactory', 'trip', '$location', 'auth', function(
    $scope, $stateParams, tripsFactory, trip, $location, auth){

    $scope.isLoggedIn = auth.isLoggedIn();

    $scope.trip = trip;
    $scope.city = {};

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    $scope.validCityForm = null;

    $scope.daysBetweenDates = function(date1, date2){
	    // The number of milliseconds in one day
	    var ONE_DAY = 1000 * 60 * 60 * 24;

	    // Convert both dates to milliseconds
	    var date1_ms = new Date(date1).getTime();
	    var date2_ms = new Date(date2).getTime();

	    // Calculate the difference in milliseconds
	    var difference_ms = Math.abs(date1_ms - date2_ms);

	    // Convert back to days and return
	    return Math.round(difference_ms/ONE_DAY) + 1;
    };


    $scope.calculateDaysLeft = function(){
    	$scope.daysLeft = $scope.daysBetween - $scope.trip.cities.reduce(function(accu, city) {
		    return accu + city.days;
		}, 0);

		console.log("TOTAL: " + $scope.daysBetween);
		console.log("LEFT: " + $scope.daysLeft);
    	
    }

    $scope.daysBetween = $scope.daysBetweenDates(trip.initDate, trip.endDate);
    $scope.daysLeft = $scope.daysBetween;
    $scope.calculateDaysLeft();

    $scope.resetCity = function(){
        $scope.city.name = '';
        $scope.city.days = null;
        $scope.validCityForm = null;
        $scope.calculateDaysLeft();
    };

    $scope.addCity = function(){
        $scope.validateCityForm();
        if($scope.validCityForm) {
            tripsFactory.addCity($scope.trip, {
                name: $scope.city.name,
                days: $scope.city.days
            }).then(function() {
		        $scope.resetCity();
		    });
            
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
        } else if ($scope.city.days <= 0){
            $scope.daysErrors = "Ingrese una número mayor a cero";
            return false;
        } else if ($scope.daysLeft - $scope.city.days < 0){
            $scope.daysErrors = "La suma de los dias es mayor a los dias totales del viaje";
            return false;
        } else {
            $scope.daysErrors = "";
            return true;
        }
    };

    $scope.validateCityForm = function(){
        $scope.validCityForm = $scope.validName();
        $scope.validCityForm = $scope.validDays() && $scope.validCityForm;
    };

    $scope.back = function(){
        $location.url("/home");
    };

}]);
