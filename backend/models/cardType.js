const mongoose = require("mongoose");

const cardTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categories:  {
      type: Array,
      ref: "Category",
      required: true,
      default: []
    },

  });

  cardTypeSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  cardTypeSchema.set("toJSON", { virtuals: true });

  module.exports = mongoose.model("CardType", cardTypeSchema);
