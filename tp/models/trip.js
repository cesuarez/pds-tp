var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripSchema = new Schema({
    name: String,
    initDate: Date,
    endDate: Date
});


module.exports = mongoose.model('Trip', TripSchema);