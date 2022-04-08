const mongoose = require("mongoose");

const cardTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category:    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

  });

  cardTypeSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  cardTypeSchema.set("toJSON", { virtuals: true });

  module.exports = mongoose.model("CardType", cardTypeSchema);
