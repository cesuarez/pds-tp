angular.module('tripsApp').controller('TripsCtrl', 
    ['$scope', '$stateParams', 'tripsFactory', 'trip', '$location', 'auth', function(
    $scope, $stateParams, tripsFactory, trip, $location, auth){

    $scope.isLoggedIn = auth.isLoggedIn();

    $scope.trip = trip;
    $scope.city = {};

    $scope.validCityForm = null;

    $scope.showCalendar = false;


    $('#calendar').fullCalendar({
        header: {
            left: '',
            center: 'title',
            right: 'prev,next'
        },
        lazyFetching: false,
        defaultDate: $scope.trip.initDate,
        editable: false
        //events: $scope.events
    });

	$scope.updateEvents = function(){
		var events = [];
		var curDate = new Date($scope.trip.initDate)
		$scope.trip.cities.forEach(function(city){
			for (i = 0; i < city.days; i++) { 
				var date = new Date(curDate).setHours(0,0,0,0);
			   	events.push({
			   		title: city.name,
			   		start: date
			   	});
			   	curDate.setDate(curDate.getDate() + 1);
			}
		});
        $('#calendar').fullCalendar( 'removeEvents');
        $('#calendar').fullCalendar( 'addEventSource', events );
	}
	$scope.updateEvents();

    $scope.toggleCalendar = function(){
        $scope.showCalendar = !$scope.showCalendar;
    }

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
    }

    $scope.daysBetween = $scope.daysBetweenDates(trip.initDate, trip.endDate);
    $scope.daysLeft = $scope.daysBetween;
    $scope.calculateDaysLeft();

    $scope.resetCity = function(){
        $scope.city.name = '';
        $scope.city.days = null;
        $scope.city.location = null;
        $scope.validCityForm = null;
        $scope.calculateDaysLeft();
        $scope.updateMap();
        $scope.updateEvents();
    };

    $scope.addCity = function(){
        $scope.validateCityForm();
        if($scope.validCityForm) {
            tripsFactory.addCity($scope.trip, {
                name: $scope.cityNameAuto,
                days: $scope.city.days,
                location: $scope.city.location
            }).then(function() {
		        $scope.resetCity();
		    });
            
        }
    };

    $scope.setCity = function(){
    	var place = this.getPlace();
    	$scope.cityNameAuto = place.name;
    	$scope.city.location = [
    		place.geometry.location.k,
    		place.geometry.location.B
    	]
    };

    $scope.eraseCityNameAuto = function(){
    	$scope.cityNameAuto = null;
    };

    $scope.updateMap = function(){
    	$scope.tripLocations = $scope.trip.cities.reduce(function(accu, city){
    		accu.push(city.location);
    		return accu;
    	}, []);
    };
    $scope.updateMap();

    $scope.validName = function() {
        if (!$scope.cityNameAuto){
            $scope.nameErrors = "Ingrese una ciudad válida";
            return false;
        } else if ($scope.trip.cities.length > 0 &&
        			$scope.trip.cities[$scope.trip.cities.length-1].name == $scope.cityNameAuto) {
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
