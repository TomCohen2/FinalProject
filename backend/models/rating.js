const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    rate: {
        type: Number,
        required: true,
    },
    date: Date
})



ratingSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  ratingSchema.set("toJSON", {
    virtuals: true,
  });
  
  module.exports = mongoose.model("Rating", ratingSchema);
  