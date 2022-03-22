const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
    max: 100,
  },
  description: {
    type: String,
    default: "",
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
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: Date,
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Product", productSchema);
