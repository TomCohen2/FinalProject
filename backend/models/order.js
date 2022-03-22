const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    required: true,
  },
  dateOrder: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    required: true,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Order", orderSchema);
