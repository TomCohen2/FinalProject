const express = require("express");
const router = express.Router();
const Card = require("../models/card");
const Category = require("../models/category");
const mongoose = require("mongoose");

router.get(`/`, async (req, res) => {
  const cardsList = await Card.find().populate("category");
  if (!cardsList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(cardsList);
});

router.get("/:id", async (req, res) => {
  const card = await Card.findById(req.params.id).populate("owner");
  const cardCalculatedPrice = card.price - 5;
  card.calculatedPrice = cardCalculatedPrice;
  const cardPrecentageSaved = (1 - card.calculatedPrice / card.value) * 100;
  const result = cardPrecentageSaved.toFixed(2) + "%";
  card.precentageSaved = result;

  if (!card) {
    res.status(500).json({
      success: false,
      message: "card not found",
    });
  }
  res.send(card);
});

router.get("/pricing/:id", async (req, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) {
    res.status(500).json({
      success: false,
      message: "card not found",
    });
  }
  res.send(card.price);
});

router.post(`/`, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
    return res
      .status(400)
      .send("Category not found. Please add a category first.");
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.owner)) {
    return res.status(400).send("Owner not found. Please add a user first.");
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res
      .status(400)
      .send("Category not found. Please add a category first.");
  }
  let card = new Card({
    name: req.body.name,
    price: req.body.price,
    value: req.body.value,
    cardNumber: req.body.cardNumber,
    image: req.body.image,
    category: req.body.category,
    owner: req.body.owner,
    isForSale: req.body.isForSale,
    createdAt: Date.now(),
    lastUpdate: Date.now(),
    expirationDate: req.body.expirationDate,
  });

  card = await card.save();
  if (!card) {
    return res.status(500).send("Error creating card");
  }
  return res.status(201).send(card);
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
  const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!card) {
    res.status(500).json({
      success: false,
      message: "card not found",
    });
  }

  res.send(card);
});

router.delete(`/:id`, (req, res) => {
  Card.findByIdAndDelete(req.params.id, (err, card) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(card);
  });
});

router.get("/get/count", async (req, res) => {
  const cardCount = await Card.countDocuments();
  if (!cardCount) {
    res.status(500).json({
      success: false,
      message: "Count not found",
    });
  }
  res.send({ cardCount: cardCount });
});

router.get("/get/featured", async (req, res) => {
  const cardsList = await Card.find({ isFeatured: true });
  if (!cardsList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(cardsList);
});

router.get("/get/:category", async (req, res) => {
  const cardsList = await Card.find({ category: req.params.category });
  if (!cardsList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(cardsList);
});

module.exports = router;
