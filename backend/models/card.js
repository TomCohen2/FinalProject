const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },

  value: {
    type: Number,
    required: true,
  },

  cardNumber: {
    type: String,
    required: true,
  },

  expirationDate: {
    type: Number,
    required: true,
  },

  lastUpdate: {
    type: Date,
  },

  image: {
    type: String,
    default: "",
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  isForSale: {
    type: Boolean,
    default: false,
  },
  createdAt: Date,
  calculatedPrice: Number,
  precentageSaved: String,
  isDeleted:Boolean,
});

cardSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

cardSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Card", cardSchema);
