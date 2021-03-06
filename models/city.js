var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = new Schema({
    name: String,
    days: { type: Number, set: function (v){return Math.round(v);} },
    places: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
    location: [Number],
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }
});


module.exports = mongoose.model('City', CitySchema);