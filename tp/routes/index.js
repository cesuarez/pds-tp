var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Trip = mongoose.model('Trip');
var User = mongoose.model('User');
var City = mongoose.model('City');
var Hotel = mongoose.model('Hotel');
var Place = mongoose.model('Place');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});



// Routes
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/***************************************************/
//                  Trip
/***************************************************/
//process.stdout.write("");

// List Trips
router.get('/trips', auth, function(req, res, next) {
    Trip.find({username:req.payload.username}, function(err, trips){
      if(err){ return next(err); }
      res.json(trips);
    });
});


// Create Trip
router.post('/trips', auth, function(req, res, next) {
    var trip = new Trip(req.body);
    trip.username = req.payload.username;

    trip.save(function(err, trip){
      if(err){ return next(err); }
      res.json(trip);
    });
});

// Delete Trip
router.delete('/trips/:trip', auth, function(req, res, next) {
    Trip.findByIdAndRemove(req.params.trip, function(err, data) {
        if (err) { return next(err); }

        Trip.find({username:req.payload.username}, function(err, trips){
            if(err){ return next(err); }
            res.json(trips);
        });
    });
});

// Get Trip
router.get('/trips/:trip', function(req, res, next) {
    Trip.findById(req.params.trip, function (err, trip){
        if (err) { return next(err); }
        if (!trip) { return next(new Error('Viaje no encontrado')); }

        trip.populate('cities', function(err, trip) {
            if (err) { return next(err); }
            res.json(trip);
        });
    });
});

// Add City
router.post('/trips/:trip/cities', auth, function(req, res, next) {
    var city = new City(req.body);

    city.save(function(err, city){
        if(err){ return next(err); }

        Trip.findById(req.params.trip, function (err, trip){
            if (err) { return next(err); }
            if (!trip) { return next(new Error('Viaje no encontrado')); }

            trip.cities.push(city);
            trip.save(function(err, trip) {
                if(err){ return next(err);}

                res.json(city);
            });
        });
    });
});

// Get City
router.get('/trips/:trip/cities/:city', function(req, res, next) {
    City.findById(req.params.city)
    .populate('hotel')
    .populate('places')
    .exec(function (err, city) {
        if (err) { return next(err); }

        process.stdout.write("CITY POPULADA: " + city);

        res.json(city);
    });
});


// Delete City
router.delete('/trips/:trip/cities/:city', auth, function(req, res, next) {
    City.findByIdAndRemove(req.params.city, function(err, data) {
        if (err) { return next(err); }
        Trip.findById(req.params.trip, function (err, trip){
            if (err) { return next(err); }
            if (!trip) { return next(new Error('Viaje no encontrado')); }
           
            trip.populate('cities', function(err, trip) {
                if (err) { return next(err); }
                res.json(trip.cities);
            });
        });
    });
});

// Create Hotel
router.post('/trips/:trip/cities/:city/hotels', auth, function(req, res, next) {
    var hotel = new Hotel(req.body);

    hotel.save(function(err, hotel){
        if(err){ return next(err); }

        City.findById(req.params.city, function (err, city){
            if (err) { return next(err); }
            if (!city) { return next(new Error('Ciudad no encontrada')); }

            city.hotel = hotel;
            city.save(function(err, city) {
                if(err){ return next(err);}

                res.json(hotel);
            });
        });
    });
});

// Update Hotel
router.post('/trips/:trip/cities/:city/hotels/:hotel', auth, function(req, res, next) {
    delete req.body._id;
    Hotel.findByIdAndUpdate(req.params.hotel, req.body, function(err, hotel){
        if (err) { return next(err); }
        if (!hotel) { return next(new Error('Hotel no encontrado')); }

        res.json({});
    });
});


// Add Place
router.post('/trips/:trip/cities/:city/places', auth, function(req, res, next) {
    var place = new Place(req.body);

    place.save(function(err, place){
        if(err){ return next(err); }

        City.findById(req.params.city, function (err, city){
            if (err) { return next(err); }
            if (!city) { return next(new Error('Ciudad no encontrada')); }

            city.places.push(place);
         
            city.save(function(err, city) {
                if(err){ return next(err);}
                process.stdout.write("CITY CON PLACE: " + city);
                res.json(place);
            });
        });
    });
});

// Delete Place
router.delete('/trips/:trip/cities/:city/places/:place', auth, function(req, res, next) {
    Place.findByIdAndRemove(req.params.place, function(err, data) {
        if (err) { return next(err); }
        City.findById(req.params.city, function (err, city){
            if (err) { return next(err); }
            if (!city) { return next(new Error('Ciudad no encontrada')); }
           
            city.populate('places', function(err, city) {
                if (err) { return next(err); }
                res.json(city.places);
            });
        });
    });
});


// Params
/*
router.param('trip', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, trip){
        if (err) { return next(err); }
        if (!trip) { return next(new Error('can\'t find trip')); }

        req.trip = trip;
        return next();
    });
});
*/

/***************************************************/
//                  User
/***************************************************/

router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Por favor llene todos los campos'});
    }

    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) return next(err);
        if (user) {
            return res.status(400).json({message: 'Lo sentimos. El nombre de usuario ya esta en uso. Intentelo otra vez'});  
        } else{
            var user = new User();
            user.username = req.body.username;
            user.setPassword(req.body.password);

            user.save(function (err){
                if(err){
                    return next(err); 
                }
                return res.json({token: user.generateJWT()});
            });

        }
    });


});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Por favor llene todos los campos'});
    }

    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
  })(req, res, next);
});

/***************************************************/
//                  Index
/***************************************************/


router.post('/index', function(req, res, next) {
});



module.exports = router;

