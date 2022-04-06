const mongoose = require("mongoose");

const cardTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
});
