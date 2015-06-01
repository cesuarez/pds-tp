angular.module('tripsApp').controller('CityCtrl', 
    ['$scope', '$stateParams', '$location', 'tripsFactory', 'city', 'trip', function(
    $scope, $stateParams, $location, tripsFactory, city, trip){

	$scope.trip = trip;
	$scope.city = city;
	$scope.hotels = [{name: "Seleccione un Hotel", place_id: "-1"}];
	if ($scope.city.hotel){
		$scope.tempHotel = $scope.city.hotel;
		$scope.hotelId = $scope.city.hotel.place_id;
	} else {
		$scope.hotelId = "-1";
	}

	$scope.calculateInitAndEnd = function(){
		var daysAccu = 0;
		$scope.trip.cities.every(function(city){
			if (city._id != $scope.city._id){
				daysAccu += city.days;
				return true;
			} else {
			    return false;
			}
		});
		$scope.initDate = new Date($scope.trip.initDate);
		$scope.initDate.setDate($scope.initDate.getDate() + daysAccu);
		$scope.endDate = new Date($scope.initDate);
		$scope.endDate.setDate($scope.endDate.getDate() + $scope.city.days - 1);
	};
	$scope.calculateInitAndEnd();

	
	//////////////////////////
	// GOOGLE MAP
	//////////////////////////

	$scope.cityLocation = new google.maps.LatLng(city.location[0], city.location[1]);
	var mapOptions = {
        zoom: 13,
        center: $scope.cityLocation
    };

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $scope.createLocation = function(point){
        var pointKeys = Object.keys(point);
        return [ point[pointKeys[0]], point[pointKeys[1]] ]
    };

    $scope.getHotelById = function(id){
    	var resHotel = null;
    	$scope.hotels.every(function(hotel){
	    	if (hotel.place_id === id){
	    		resHotel = hotel;
	    		return false;
	    	} else {
	    		return true;
	    	}
    	});
    	return resHotel;
    };

    $scope.updateHotelMarker = function(){
		// Si hay lo borro
		if ($scope.hotelMarker) $scope.hotelMarker.setMap(null);

		// Lo creo denuevo
		if ($scope.hotelId !== '-1'){
    		var point = new google.maps.LatLng($scope.tempHotel.location[0], $scope.tempHotel.location[1]);
    		$scope.hotelMarker = new google.maps.Marker({
                position: point,
                title: $scope.tempHotel.name,
                icon: "images/hotel_marker.png",
                map: $scope.map
            });
		}
    };

    $scope.updateMap = function(){
    	$scope.updateHotelMarker();
	};
	
	// Search for Hotels Nearby
	var request = {
	    location: $scope.cityLocation,
	    radius: '3000',
	    types: ['lodging']
	};
	$scope.service = new google.maps.places.PlacesService($scope.map);
    $scope.service.nearbySearch(request, function(results, status){
    	$scope.$apply(function(){
	    	if (status == google.maps.places.PlacesServiceStatus.OK) {
			    results.forEach(function(hotel){
			    	hotel.location = $scope.createLocation(hotel.geometry.location);
			    	$scope.hotels.push(hotel);
			    });
		    }
		    $scope.updateMap();
    	});
    });


    $scope.saveHotel = function(){
    	var hotelJson = {
			place_id: $scope.hotelId,
			name: $scope.tempHotel.name,
			location: $scope.tempHotel.location,
			rating: $scope.tempHotel.rating,
			formatted_address: $scope.tempHotel.formatted_address,
			website: $scope.tempHotel.website,
			formatted_phone_number: $scope.tempHotel.formatted_phone_number
		}

		if ($scope.city.hotel){
			hotelJson._id = $scope.city.hotel._id;
			tripsFactory.updateHotel($scope.trip, $scope.city, hotelJson).then(function() {
	            $scope.updateMap();
	        });
		} else {
			tripsFactory.createHotel($scope.trip, $scope.city, hotelJson).then(function() {
	            $scope.updateMap();
	        });
		}		
	}

	$scope.hotelChanged = function(){
		var request = { placeId: $scope.hotelId };
		$scope.service.getDetails(request, function(detailedHotel, status){
			$scope.$apply(function(){
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					$scope.tempHotel = detailedHotel;
					console.log(detailedHotel);
					$scope.tempHotel.location = $scope.createLocation($scope.tempHotel.geometry.location);
					$scope.updateHotelMarker();
				}
			});
		});
	}

	$scope.back = function(){
        $location.url("/trips/" + $stateParams.trip_id); 
    };

}]);