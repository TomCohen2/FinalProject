const express = require("express");
const router = express.Router();
const Card = require("../models/card");
const Category = require("../models/category");
const mongoose = require("mongoose");

router.get(`/`, async (req, res) => {
  const cardsList = await Card.find();
  if (!cardsList) {
    res.status(500).json({
      success: false,
    });
  }

  res.send(cardsList);
});

router.get("/:id", async (req, res) => {
  const card = await Card.findById(req.params.id);
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
  res.status(200).send(card);
});


router.post(`/`, async (req, res) => {
  console.log(req.body)
  if (!mongoose.Types.ObjectId.isValid(req.body.cardType)) {
    return res
      .status(400)
      .send("CardType not found. Please add a Valid CardType first.");
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.owner)) {
    return res.status(400).send("Owner not found. Please add a user first.");
  }

  let card = new Card({
    price: req.body.price,
    value: req.body.value,
    cardNumber: req.body.cardNumber,
    cardType: req.body.cardType,
    owner: req.body.owner,
    isForSale: req.body.isForSale,
    createdAt: Date.now(),
    lastUpdate: Date.now(),
    expirationDate: req.body.expirationDate,
    isDeleted: false,
  });

  card = await card.save();
  if (!card) {
    return res.status(500).send("Error creating card");
  }
  //TODO REMOVE THIS AND MOVE TO FUNCTION
  const cardCalculatedPrice = card.price - 5;
  card.calculatedPrice = cardCalculatedPrice;
  const cardPrecentageSaved = (1 - card.calculatedPrice / card.value) * 100;
  const result = cardPrecentageSaved.toFixed(2) + "%";
  card.precentageSaved = result;

  return res.status(200).send(card);
});

router.put(`/:id`, async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (category) {
    if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res
        .status(400)
        .send("Category not found. Please add a category first.");
    }
  }

  req.body.lastUpdate = Date()
  const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!card) {
    res.status(500).json({
      success: false,
      message: "card not found",
    });
  }

  res.send(card);
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

module.exports = router;
