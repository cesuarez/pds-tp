var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HotelSchema = new Schema({
	name: String,
	location: [Number],
	place_id: String,
	rating: Number,
	formatted_address: String,
	website: String,
	formatted_phone_number: String
});


module.exports = mongoose.model('Hotel', HotelSchema);


