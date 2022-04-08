const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const card = require("../models/card");
const CoinTransaction = require("../models/coinTransaction");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post(`/`, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.from)) {
      return res.status(400).send("'from' User not found. Please provide an exising user first.");
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.to)) {
        return res.status(400).send("'to' User not found. Please provide an exising user first.");
      }

    let coinTransactionSchema = new CoinTransaction({
      from: req.body.from,
      to: req.body.to,
      amount: req.body.amount,
      date: Date.now(),
    });
  
    coinTransactionSchema = await coinTransactionSchema.save();
    if (!coinTransactionSchema) {
      return res.status(500).send("Error creating coin Transaction");
    }
    return res.status(201).send(coinTransactionSchema);
  });

  router.get(`/`, async (req, res) => {
    const cardsList = await CoinTransaction.find();
    if (!cardsList) {
      res.status(500).json({
        success: false,
      });
    }
    res.send(cardsList);
  });
  

router.get(`/from/:id`, async (req, res) => {
  const coinTransactionList = await CoinTransaction.find({ from: req.params.id });
    if (!coinTransactionList) {
      res.status(500).json({
        success: false,
      });
    }
    res.send(coinTransactionList);
  });
  

router.get(`/to/:id`, async (req, res) => {
    const coinTransactionList = await CoinTransaction.find({ to: req.params.id });
      if (!coinTransactionList) {
        res.status(500).json({
          success: false,
        });
      }
      res.send(coinTransactionList);
    });


    router.get(`/income/:id`, async (req, res) => {
      const coinTransactionList = await CoinTransaction.find({ to: req.params.id });
        if (!coinTransactionList) {
          res.status(500).json({
            success: false,
          });
        }
        sum=0
        number_of_transactions=0
        coinTransactionList.forEach(element => {
          sum += element.amount
          number_of_transactions += 1          
        });
        res.send({"income": sum, "Transactions": number_of_transactions});
      });

      
router.get(`/outcome/:id`, async (req, res) => {
  const coinTransactionList = await CoinTransaction.find({ from: req.params.id });
    if (!coinTransactionList) {
      res.status(500).json({
        success: false,
      });
    }
    sum=0
    number_of_transactions=0
    coinTransactionList.forEach(element => {
      sum += element.amount
      number_of_transactions += 1          
    });
    res.send({"outcome": sum, "Transactions": number_of_transactions});

  });
    

  module.exports = router;
