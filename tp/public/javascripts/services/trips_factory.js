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

	o.deleteCity = function(trip, city_id ) {
		return $http.delete('/trips/' + trip._id + '/cities/' + city_id, {headers: {Authorization: 'Bearer ' + auth.getToken()}}
		).success(function(data){
	        angular.copy(data, trip.cities);
	    });
	};

  	return o;
}]);
