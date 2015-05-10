angular.module('tripsApp').factory('tripsFactory', ['$http', 'auth', function($http, auth){
  	var o = {
    	trips: []
  	};

  	o.get = function(id) {
	    return $http.get('/trips/' + id).then(function(res){
	    	return res.data;
	    });
		
  		// Para no ir al servidor
  		// return o.trips.filter(function(trip) {return trip._id == id;})[0]
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
	}

	o.addCity = function(trip, city) {
		return $http.post('/trips/' + trip._id + '/cities', city, 
			{headers: {Authorization: 'Bearer ' + auth.getToken()}}
		).success(function(data){
			trip.cities.push(data);
		});
	}

  	return o;
}]);
