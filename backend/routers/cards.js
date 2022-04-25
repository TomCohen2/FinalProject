const express = require("express");
const router = express.Router();
const Card = require("../models/card");
const Category = require("../models/category");
const authenticate = require("../helpers/auth");
const {updateCard, getAllCards,getAllCardsById,getCardById, addCard}=require('../controllers/cards-controllers');

router.get(`/`, authenticate, getAllCards);

router.get(`/owner/:id`, authenticate, getAllCardsById);


router.get("/:id", authenticate, getCardById);


router.post(`/`, authenticate, addCard);

router.put(`/:id`, authenticate, updateCard);

module.exports = router;
