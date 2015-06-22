angular.module('tripsApp').factory('tripsFactory', ['$http', 'auth', function($http, auth){
  	var o = {
    	trips: []
  	};

  	o.get = function(id) {
	    return $http.get('/trips/' + id).then(function(res){
	    	return res.data;
	    });
	};

	o.getCity = function(tripId, cityId){
		return $http.get('/trips/' + tripId + '/cities/' + cityId).then(function(res){
	    	return res.data;
	    });
	};

  	o.getAll = function() {
	    return $http.get('/trips', {headers: {Authorization: 'Bearer ' + auth.getToken()}}
	    	).success(function(data){
	        	angular.copy(data, o.trips);
	    });
	};

	o.create = function(trip) {
	    return $http.post('/trips', trip, {headers: {Authorization: 'Bearer ' + auth.getToken()}}
		).success(function(data){
	    	o.trips.push(data);
	    });
	};

	o.delete = function(id) {
		return $http.delete('/trips/' + id, {headers: {Authorization: 'Bearer ' + auth.getToken()}}
		).success(function(data){
	        angular.copy(data, o.trips);
	    });
	};

	o.addCity = function(trip, city) {
		return $http.post('/trips/' + trip._id + '/cities', city, 
			{headers: {Authorization: 'Bearer ' + auth.getToken()}}
		).success(function(data){
			trip.cities.push(data);
		});
	};

	o.updateHotel = function(trip, city, hotel) {
		return $http.post('/trips/' + trip._id + '/cities/' + city._id + '/hotels/' + hotel._id, hotel, 
			{headers: {Authorization: 'Bearer ' + auth.getToken()}}
		).success(function(data){
			angular.copy(hotel, city.hotel);
		});
	};

	o.createHotel = function(trip, city, hotel) {
		return $http.post('/trips/' + trip._id + '/cities/' + city._id + '/hotels', hotel, 
			{headers: {Authorization: 'Bearer ' + auth.getToken()}}
		).success(function(data){
			city.hotel = data;
		});
	};
/*
	o.getPlace = function(city, place_id) {
	    return $http.get('cities/' + city._id + '/places/' + place_id).then(function(res){
	    	return res.data;
	    });
	};
*/
	o.addPlace = function(trip, city, place) {
		return $http.post('/trips/' + trip._id + '/cities/' + city._id + '/places', place, 
			{headers: {Authorization: 'Bearer ' + auth.getToken()}}
		).success(function(data){
			city.places.push(data);
		});
	};

	o.deletePlace = function(trip, city, place_id) {
		return $http.delete('/trips/' + trip._id + '/cities/' + city._id + '/places/' + place_id, {headers: {Authorization: 'Bearer ' + auth.getToken()}}
		).success(function(data){
	        angular.copy(data, city.places);
	    });
	};

	o.deleteCity = function(trip, city_id) {
		return $http.delete('/trips/' + trip._id + '/cities/' + city_id, {headers: {Authorization: 'Bearer ' + auth.getToken()}}
		).success(function(data){
	        angular.copy(data, trip.cities);
	    });
	};

  	return o;
}]);
