const express = require("express");
const router = express.Router();
const CardType = require("../models/cardType");
const mongoose = require("mongoose");
const authenticate = require("../helpers/auth");


router.get(`/`, authenticate,async (req, res) => {
    const cardTypesList = await CardType.find();
    if (!cardTypesList) {
      res.status(500).json({
        success: false,
      });
    }
  
    res.send(cardTypesList);
  });


router.post(`/`,authenticate ,async (req, res) => { //todo add validation of category
    let cardType = new CardType({
      name: req.body.name,
      categories: req.body.categories,
    });
  
    cardType = await cardType.save();
    if (!cardType) {
      return res.status(500).send("Error creating cardType");
    }
    return res.status(201).send(cardType);
  });



  module.exports = router;
  