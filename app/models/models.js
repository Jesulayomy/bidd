const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const { Schema } = mongoose;


const userSchema = new Schema({
  name: String,
  email: String,
  password: String
});

const itemSchema = new Schema({
  name: String,
  description: String,
  imgURL: String,
  basePrice: Number,
  highestBid: Number,
  highestBidder: userSchema,
  bids: [{user: userSchema, bid: Number, premium: Boolean}]
});


userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = {
  User: mongoose.model('User', userSchema),
  Item: mongoose.model('Item', itemSchema),
};
