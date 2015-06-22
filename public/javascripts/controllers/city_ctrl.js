angular.module('tripsApp').controller('CityCtrl', 
    ['$scope', '$stateParams', '$location', 'tripsFactory', 'city', 'trip', function(
    $scope, $stateParams, $location, tripsFactory, city, trip){

	function clone(obj) {
	    if (null == obj || "object" != typeof obj) return obj;
	    var copy = obj.constructor();
	    for (var attr in obj) {
	        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	    }
	    return copy;
	}

	$scope.trip = trip;
	$scope.city = city;
	$scope.hotels = [{name: "Seleccione un Hotel", place_id: "-1"}];
	if ($scope.city.hotel){
		$scope.tempHotel = clone($scope.city.hotel);
		//$scope.hotelId = $scope.city.hotel.place_id;
	} else {
		$scope.tempHotel = $scope.hotels[0];
		//$scope.hotelId = "-1";
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
		if ($scope.tempHotel.place_id !== '-1'){
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
	    radius: '2500',
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
			place_id: $scope.tempHotel.place_id,
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
		var request = { placeId: $scope.tempHotel.place_id };
		$scope.service.getDetails(request, function(detailedHotel, status){
			$scope.$apply(function(){
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					$scope.tempHotel = detailedHotel;
					$scope.tempHotel.location = $scope.createLocation($scope.tempHotel.geometry.location);
					$scope.updateHotelMarker();
				}
			});
		});
	}

	///////////////////////
	// DIEGO
	///////////////////////
	
    $scope.allPlaces = function() {

        var cityLocation = new google.maps.LatLng($scope.city.location[0], $scope.city.location[1]);
        var request = {
            location: cityLocation,
            radius: '2500',
        };
        var service = new google.maps.places.PlacesService($scope.map);
        service.nearbySearch(request, $scope.callbackAll);
     };

/*
    $scope.listPlaces = function(coords) {

        var cityLocation = new google.maps.LatLng(coords[0], coords[1]);
        var request = {
            location: cityLocation,
            radius: 500,
            types: ['store']
        };
        var service = new google.maps.places.PlacesService($scope.map);
        service.nearbySearch(request, $scope.callbackList);
     };
*/

	$scope.markers = [];
    $scope.callbackAll = function(results, status) {
    	console.log($scope.markers);
      	if ($scope.markers.length > 0){
			$scope.markers.forEach(function(marker){
				marker.setMap(null);
			});
			$scope.markers = [];
      	} else {
      		if (status == google.maps.places.PlacesServiceStatus.OK) {
      			results.forEach(function(place){
		        	if (place.types.filter(function(type) {return type === "lodging"}).length == 0){
		            	$scope.createMarker(place);
		        	}
		        });
      		}
      	}
    };
/*
    $scope.callbackList = function(results, status) {
      $scope.listPlaces = results;
    };
*/
	$scope.createMarker = function(place) {
      	var placeLoc = place.geometry.location;
      	var marker = new google.maps.Marker({
	        map: $scope.map,
	        position: place.geometry.location,
	        title: place.name,
	        icon: {
			    url: place.icon, // url
			    scaledSize: new google.maps.Size(30, 30), // scaled size
			    origin: new google.maps.Point(0,0), // origin
			    anchor: new google.maps.Point(0, 0) // anchor
			}
      	});
      	$scope.markers.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
			console.log(place);
        	if ($scope.city.places.filter(function(place) {return place.title == marker.title;}).length == 0){
			  	tripsFactory.addPlace($scope.trip, $scope.city, {
			  		title: marker.title,
			  		location: $scope.createLocation(marker.position)
			  	});
        	}
		});
    };

    $scope.deletePlace = function(placeId){
		tripsFactory.deletePlace(trip, city, placeId);
    }

	$scope.back = function(){
        $location.url("/trips/" + $stateParams.trip_id); 
    };

}]);