const mongoose = require("mongoose");


const cardTransactionSchema = new mongoose.Schema({
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },

      sellerEmail: {
        type: String,
        required: true,
      },
    
      buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },

      buyerEmail: {
        type: String,
        required: true,
      },
    
      card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "card",
        required: true,
      },

      cardType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cardType",
        required: true,
      },

      boughtFor: {
        type: Number,
        required: true,
      },

      cardValue: {
        type: Number,
        required: true,
      },

      satisfied:{
        type: Boolean,
        default: null
      },
      buyerComment: {
        type:String,
        default:null
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
