let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reviewSchema = new Schema({
   body: String,
   rating: Number,
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
});

module.exports = new mongoose.model('Review', reviewSchema);