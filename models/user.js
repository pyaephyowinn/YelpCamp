const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true
   }
});

userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model('User', userSchema);