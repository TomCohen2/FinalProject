const mongoose = require("mongoose");


const cardTransactionSchema = new mongoose.Schema({
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },

      buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },

      card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "card",
        required: true,
      },
      boughtFor: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
      }

    });
  
    cardTransactionSchema.virtual("id").get(function () {
      return this._id.toHexString();
    });
    cardTransactionSchema.set("toJSON", { virtuals: true });
  

module.exports = mongoose.model("CardTransaction", cardTransactionSchema);
