var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: String,
  author: String,
  time: Date,
  upvotes: {type: Number, default: 0},
  post: { type: Schema.Types.ObjectId, ref: 'Post' }
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};


module.exports = mongoose.model('Comment', CommentSchema);