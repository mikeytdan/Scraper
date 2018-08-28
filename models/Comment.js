var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  text: String
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;