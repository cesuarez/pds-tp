var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({
    title: String,
    location: [Number]
});

module.exports = mongoose.model('Place', PlaceSchema);