const express = require("express");
const router = express.Router();
const CardTransaction = require("../models/cardTransaction");
const mongoose = require("mongoose");
const authenticate = require("../helpers/auth");

router.post("/", authenticate,async (req, res) => { //add checkups for parameters
    let ct = new CardTransaction({
        seller: req.body.seller,
        buyer: req.body.buyer,
        card: req.body.card,
        boughtFor: req.body.boughtFor,
        date: Date.now()
      });
    
      ct = await ct.save();
      if (!ct) {
        return res.status(500).send("Error creating cardType");
      }
      return res.status(201).send(ct);

  })

router.get("/seller/:id", authenticate, async (req, res) => {
    const l = await CardTransaction.find({ seller: req.params.id });
    if (!l) {
      res.status(500).json({
        success: false,
      });
    }
    res.send(l);
})

router.get("/buyer/:id", authenticate,async (req, res) => {
    const l = await CardTransaction.find({ buyer: req.params.id });
    if (!l) {
      res.status(500).json({
        success: false,
      });
    }
    res.send(l);

})

router.get("/card/:id", authenticate,async (req, res) => {
    const l = await CardTransaction.find({ card: req.params.id });
    if (!l) {
      res.status(500).json({
        success: false,
      });
    }
    res.send(l);
})

module.exports = router