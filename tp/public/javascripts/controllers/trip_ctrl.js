angular.module('tripsApp').controller('TripsCtrl', 
    ['$scope', '$stateParams', 'tripsFactory', 'trip', '$location', 'auth', function(
    $scope, $stateParams, tripsFactory, trip, $location, auth){

    $scope.isLoggedIn = auth.isLoggedIn();

    $scope.trip = trip;
    $scope.city = {};

    $scope.validCityForm = null;

    $scope.showCalendar = false;

    $scope.updateEvents = function(){
        $scope.events = [];
        var curDate = new Date($scope.trip.initDate)
        $scope.trip.cities.forEach(function(city){
            for (i = 0; i < city.days; i++) { 
                var date = new Date(curDate).setHours(0,0,0,0);
                $scope.events.push({
                    title: city.name,
                    start: date
                });
                curDate.setDate(curDate.getDate() + 1);
            }
        });

        var wasHidden = !$scope.showCalendar;

        $('#calendar').removeClass('hidden');
        $('#calendar').fullCalendar( 'removeEvents');
        $('#calendar').fullCalendar( 'addEventSource', $scope.events );
        $('#calendar').fullCalendar( 'rerenderEvents' );
        if (wasHidden){
            $('#calendar').addClass('hidden');
        }
    }

    $('#calendar').fullCalendar({
        header: {
            left: '',
            center: 'title',
            right: 'prev,next'
        },
        lazyFetching: false,
        defaultDate: $scope.trip.initDate,
        editable: false
    });

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
        $scope.updateViewVariables();
    };

    $scope.updateViewVariables = function(){
        $scope.updateMap();
        $scope.calculateDaysLeft();
        $scope.updateEvents();
    }

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

    $scope.removeCity = function(){
        tripsFactory.deleteCity($scope.trip, $scope.cityToRemove).then(function(){
            $scope.showDeletePopupCity(false);
            $scope.updateViewVariables();
        });
    }

    $scope.prepareForDeleteCity = function(city_id){
        $scope.cityToRemove = city_id;
        $scope.showDeletePopupCity(true);
    };

    $scope.showDeletePopupCity = function(bool) {
        $scope.displayCityDeletePopup = bool;
    };

    $scope.createLocation = function(point){
        var pointKeys = Object.keys(point);
        return [ point[pointKeys[0]], point[pointKeys[1]] ]
    };

    $scope.setCity = function(){
        var place = this.getPlace();
        console.log(place);
        $scope.cityNameAuto = place.name;
        $scope.city.location = $scope.createLocation(place.geometry.location);
    };

    $scope.eraseCityNameAuto = function(){
        $scope.cityNameAuto = null;
    };
    

    ////////////////////////////////
    // GOOGLE MAPS
    ////////////////////////////////

    $scope.maxZoom = 7;

    $scope.updatePolyline = function(){
        $scope.tripLocations = $scope.trip.cities.reduce(function(accu, city){
            accu.push(new google.maps.LatLng(city.location[0], city.location[1]));
            return accu;
        }, []);

        // Si hay lo borro
        if ($scope.polyline) $scope.polyline.setMap(null);

        // Lo creo denuevo
        $scope.polyline = new google.maps.Polyline({
            path: $scope.tripLocations,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        $scope.polyline.setMap($scope.map);
    };

    $scope.markers = [];

    $scope.updateMarkers = function(){
        // Si hay los borro
        if ($scope.markers) {
            $scope.markers.forEach(function(marker){
                marker.setMap(null);
            });
            $scope.markers = [];  
        } 

        // Los creo denuevo
        $scope.trip.cities.forEach(function(city){
            var point = new google.maps.LatLng(city.location[0], city.location[1]);
            var marker = new google.maps.Marker({
                position: point,
                title:city.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5
                },
                map: $scope.map
            });
            $scope.markers.push(marker);
        });

    };

    $scope.updateMapCenter = function(){
        var bounds = new google.maps.LatLngBounds();

        $scope.tripLocations.forEach(function(point){
            bounds.extend( point );
        });

        if ($scope.tripLocations.length > 1) {
            $scope.map.fitBounds(bounds);
        } else {
            $scope.map.setCenter(bounds.getCenter());
            $scope.map.setZoom($scope.maxZoom);
        }

        /*
        $scope.map.fitBounds(bound);
        var listener = google.maps.event.addListenerOnce($scope.map, 'zoom_changed', function() { 
            if ($scope.map.getZoom() > $scope.maxZoom) $scope.map.setZoom($scope.maxZoom); 
        });*/
    };

    var mapOptions = {
        zoom: 1,
        center: new google.maps.LatLng(0, 0)
    };

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $scope.updateMap = function(){
        $scope.updatePolyline();
        $scope.updateMapCenter();
        $scope.updateMarkers();
    };
    $scope.updateMap();

    
    ////////////////////////////////
    // VALIDATIONS 
    ////////////////////////////////

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
