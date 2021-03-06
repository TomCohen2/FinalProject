const Card = require('../models/card')
const Category = require('../models/category')
const mongoose = require("mongoose");
const {getCalculatedPrice, getPrecentageSaved} = require('../utils');

const updateCard = async (req, res) => {
  const category = await Category.findById(req.body.category)
  if (category) {
    if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res
        .status(400)
        .send('Category not found. Please add a category first.')
    }
  }
  req.body.lastUpdate = new Date()
  const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  if (!card) {
    return res.status(500).json({
      success: false,
      message: 'card not found',
    })
  }
  res.send(card)
}

const getAllCards = async (req, res, next) => {
  let allcardsList = await Card.find()
  if (!allcardsList) {
    res.status(500).json({
      success: false,
    })
  }
  allcardsList.map((card) => {
    card.calculatedPrice = getCalculatedPrice(card.price, card.expirationDate)
    card.precentageSaved = getPrecentageSaved(card.calculatedPrice, card.value)
  })
  res.send(allcardsList.filter((c) => c.isDeleted == false))
}

const getAllCardsById = async (req, res) => {
  let allcardsList = await Card.find()
  if (!allcardsList) {
    res.status(500).json({
      success: false,
    })
  }

  allcardsList.map((card) => {
    card.calculatedPrice = getCalculatedPrice(card.price, card.expirationDate)
    card.precentageSaved = getPrecentageSaved(card.calculatedPrice, card.value)
  })

  res.send(
    allcardsList
      .filter((c) => c.isDeleted == false)
      .filter((c) => c.owner._id.toString() == req.params.id),
  )
}

const getCardById = async (req, res) => {
  const card = await Card.findById(req.params.id)
  card.calculatedPrice = getCalculatedPrice(card.price, card.expirationDate)
  card.precentageSaved = getPrecentageSaved(card.calculatedPrice, card.value)

  if (!card) {
    res.status(500).json({
      success: false,
      message: 'card not found',
    })
  }
  res.status(200).send(card)
}

const addCard = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.cardType)) {
    return res
      .status(400)
      .send('CardType not found. Please add a Valid CardType first.')
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.owner)) {
    return res.status(400).send('Owner not found. Please add a user first.')
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
  })

  card = await card.save()
  if (!card) {
    return res.status(500).send('Error creating card')
  }

  card.calculatedPrice = getCalculatedPrice(card.price, card.expirationDate)
  card.precentageSaved = getPrecentageSaved(card.calculatedPrice, card.value)

  return res.status(200).send(card)
}

module.exports = {
  updateCard,
  getAllCards,
  getAllCardsById,
  getCardById,
  addCard,
}
