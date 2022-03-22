const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");

router.get(`/`, async (req, res) => {
  const productsList = await Product.find().populate("category");
  if (!productsList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productsList);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
    return res
      .status(400)
      .send("Category not found. Please add a category first.");
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res
      .status(400)
      .send("Category not found. Please add a category first.");
  }
  let product = new Product({
    name: req.body.name,
    price: req.body.price,
    value: req.body.value,
    quantity: req.body.quantity,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    isFeatured: req.body.isFeatured,
    createdAt: Date.now(),
  });

  product = await product.save();
  if (!product) {
    return res.status(500).send("Error creating product");
  }
  return res.status(201).send(product);
});

router.put(`/:id`, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
    return res
      .status(400)
      .send("Category not found. Please add a category first.");
  }
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res
      .status(400)
      .send("Category not found. Please add a category first.");
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) {
    res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  res.send(product);
});

router.delete(`/:id`, (req, res) => {
  Product.findByIdAndDelete(req.params.id, (err, product) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(product);
  });
});

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) {
    res.status(500).json({
      success: false,
      message: "Count not found",
    });
  }
  res.send({ productCount: productCount });
});

router.get("/get/featured", async (req, res) => {
  const productsList = await Product.find({ isFeatured: true });
  if (!productsList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productsList);
});

router.get("/get/:category", async (req, res) => {
  const productsList = await Product.find({ category: req.params.category });
  if (!productsList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productsList);
});

module.exports = router;
