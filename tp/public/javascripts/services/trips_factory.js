angular.module('tripsApp').factory('tripsFactory', ['$http', function($http){
  	var o = {
    	trips: []
  	};

  	o.get = function(id) {
  		return o.trips.filter(function(trip) {return trip._id == id;})[0]

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

	o.delete = function(id) {
		$http.put('/trips/' + id + '/delete').success(function(data){
	        angular.copy(data, o.trips);
	    });
	}

  	return o;
}]);
