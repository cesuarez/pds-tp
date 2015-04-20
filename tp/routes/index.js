
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Trip = mongoose.model('Trip');

// Routes
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// List Trips
router.get('/trips', function(req, res, next) {
    Trip.find(function(err, trips){
    	if(err){ return next(err); }
    	res.json(trips);
    });
});

// Create Trip
router.post('/trips', function(req, res, next) {
    var trip = new Trip(req.body);

    trip.save(function(err, trip){
    	if(err){ return next(err); }
    	res.json(trip);
    });
});

// Get Trip
/*
router.get('/trips/:trip', function(req, res) {
    req.post.populate('comments', function(err, post) {
	    if (err) { return next(err); }

	    res.json(post);
    });
});
*/


// Params
router.param('trip', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, trip){
    	if (err) { return next(err); }
    	if (!trip) { return next(new Error('can\'t find trip')); }

    	req.trip = trip;
    	return next();
    });
});

module.exports = router;

