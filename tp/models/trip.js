var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripSchema = new Schema({
    name: String,
    initDate: Date,
    endDate: Date,
    username: String,
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }]
});


module.exports = mongoose.model('Trip', TripSchema);