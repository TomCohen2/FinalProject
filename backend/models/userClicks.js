const mongoose = require("mongoose");

const userClicksSchema= new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cardTypeId: {
    type: String,
    required: true,
  },
  numOfClicks: {
    type: Number,
    required: true,
    default: 0
  }
});

  module.exports = mongoose.model("UserClicks", userClicksSchema);