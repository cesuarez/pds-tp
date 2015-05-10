var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = new Schema({
    name: String,
    days: { type: Number, set: function (v){return Math.round(v);} }
});


module.exports = mongoose.model('City', CitySchema);