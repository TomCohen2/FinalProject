const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authenticate = require("../helpers/auth");
const Rating = require("../models/rating");


router.post("/", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.from) || !mongoose.Types.ObjectId.isValid(req.body.to)) {
    return res
        .status(400)
        .send("from ID not found. Please add a category first.");
    }
    let rating = new Rating({
        from: req.body.from,
        to: req.body.to,
        rate: req.body.rate,
        date: Date.now(),

    })
    rating = await rating.save();
    if (!rating) {
      return res.status(500).send("Error creating rating record");
    }
  
    res.status(200).send(rating);
})

router.get("/to/:id", async(req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send("NOT A VALID USER ID")
    
    let allRatings = await Rating.find();
    allRatings.filter(r=> r.to = req.params.id)
    if (allRatings.length==0) return res.status(200).send({rate_avg:0, rate_count:0})
    let ratingSum=0;
    allRatings.forEach(r => ratingSum += r.rate)
    res.status(200).send({
        rate_avg : ratingSum/allRatings.length,
        rate_count : allRatings.length
    })

})

module.exports = router;