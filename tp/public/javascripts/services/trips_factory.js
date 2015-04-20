angular.module('tripsApp').factory('tripsFactory', ['$http', function($http){
  	var o = {
    	trips: []
  	};

  	o.get = function(id) {
  		return _.find(o.trips, function(trip) { return trip.id === id })

  		// Usar cuando se requiera ir al servidor a buscar info del "Trip"
	    /* 
	    return $http.get('/trips/' + id).then(function(res){
	    	return res.data;
	    });
		*/
	};

  	o.getAll = function() {
	    return $http.get('/trips').success(function(data){
	        angular.copy(data, o.trips);
	    });
	};

	o.create = function(trip) {
	    return $http.post('/trips', trip).success(function(data){
	    	o.trips.push(data);
	    });
	};

  	return o;
}]);
