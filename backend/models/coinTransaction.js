const mongoose = require("mongoose");

const coinTransactionSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true,
    },
    date: Date
})



coinTransactionSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  coinTransactionSchema.set("toJSON", {
    virtuals: true,
  });
  
  module.exports = mongoose.model("CoinTransaction", coinTransactionSchema);
  