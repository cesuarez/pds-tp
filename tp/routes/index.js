var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Trip = mongoose.model('Trip');
//var User = require('./../models/user.js');
var User = mongoose.model('User');
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
    Trip.findByIdAndRemove(req.param("trip"), function(err, data) {
        if (err) { return next(err); }

        Trip.find({username:req.payload.username}, function(err, trips){
            if(err){ return next(err); }
            res.json(trips);
        });
    });
});

// Get Trip
router.get('/trips/:trip', function(req, res, next) {
    Trip.findById(req.param("trip"), function (err, trip){
        if (err) { return next(err); }
        if (!trip) { return next(new Error('Viaje no encontrado')); }

        res.json(trip);
    });
/*
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }
        res.json(post);
    });
*/
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

