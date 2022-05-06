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
        res.status(500).send("Error creating cardType");
      }
      console.log(ct)
      res.status(200).send(ct);

  })


router.put("/:id", authenticate,async (req, res) => { //add checkups for parameters
    let ct = await CardTransaction.findById(req.params.id);
    if (!ct) {
      return res.status(500).send("cardTransaction not found");
    }  

    ct = await CardTransaction.findByIdAndUpdate(
    req.params.id,
    {
      satisfied: req.body.satisfied,
      buyerComment: req.body.buyerComment,
    },

    { new: true }
  );

  if (!ct) {
    return res.status(500).send("Error updating user");
  }
  ct = await ct.save();

  return res.status(200).send({
    id: ct._id,
    seller: ct.seller,
    buyer: ct.buyer,
    card: ct.card,
    boughtFor: ct.boughtFor,
    satisfied: ct.satisfied,
    buyerComment: ct.buyerComment,
    date: ct.date
  });
});

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


router.get("/:user_id", authenticate,async (req, res) => {
  const l = await CardTransaction.find({ buyer: req.params.user_id });
  const l2 = await CardTransaction.find({ seller: req.params.user_id });
  if (!l || !l2) {
    res.status(500).json({
      success: false,
    });
  }
  l2.forEach(c=>{l.push(c)})
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


router.get(`/outcome/:id`, authenticate, async (req, res) => {
  const l = await CardTransaction.find({ buyer: req.params.id });
  if (!l) {
      res.status(500).json({
        success: false,
      });
    }
    sum=0
    number_of_transactions=0
    l.forEach(element => {
      sum += element.boughtFor
      number_of_transactions += 1          
    });
    res.send({"outcome": sum, "Transactions": number_of_transactions});

  });



  router.get(`/income/:id`, authenticate, async (req, res) => {
    const l = await CardTransaction.find({ seller: req.params.id });
    if (!l) {
        res.status(500).json({
          success: false,
        });
      }
      sum=0
      number_of_transactions=0
      l.forEach(element => {
        sum += element.boughtFor
        number_of_transactions += 1          
      });
      res.send({"income": sum, "Transactions": number_of_transactions});
  
    });
  
router.get("/sellerRatings/:id", authenticate, async (req, res) => {
  let l = await CardTransaction.find({seller: req.params.id}) // total sells
  let goodCount=0;
  let badCount=0;
  l.forEach(t=>{
    if (t.satisfied == null) return;
    else if (t.satisfied == true) goodCount+=1
    else if (t.satisfied == false) badCount +=1;
      
  })
  res.status(200).send({good: goodCount,bad:badCount,total: l.length})

} )
module.exports = router