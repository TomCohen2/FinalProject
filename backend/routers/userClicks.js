const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authenticate = require("../helpers/auth");
const { findOne, update, findOneAndUpdate } = require("../models/userClicks");
const UserClicks = require("../models/userClicks");

router.get(`/`, authenticate,async (req, res) => {
    const clicks = await UserClicks.find();
    if (!clicks) {
     return  res.status(500).json({
        success: false,
      });
    }
    // console.log(cardTypesList)
   return res.status(200).send(userClicks);
  });

  router.post(`/`,authenticate ,async (req, res) => { 
    const user = await UserClicks.findOne({userId: req.body.userId, cardTypeId: req.body.cardTypeId});
    let updatedUser;
      if (user) {
          updatedUser = await UserClicks.findOneAndUpdate({userId: req.body.userId, cardTypeId: req.body.cardTypeId}, {numOfClicks: user.numOfClicks + 1},{ new: true});
      }

    if (updatedUser) {
    return res.status(200).send({
     updatedUser
       
    });
    }

     let userClicks = new UserClicks({
      userId: req.body.userId,
      cardTypeId: req.body.cardTypeId,
      numOfClicks: 1
    });
     userClicks = await userClicks.save();
    if (!userClicks) {
      return res.status(500).send("Error creating userClicks");
    }
    return res.status(201).send(userClicks);
    
  });

module.exports = router;
