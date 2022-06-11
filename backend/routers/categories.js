const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const authenticate = require("../helpers/auth");

router.get(`/`,authenticate, async (req, res) => {
  let categoriesList = await Category.find();
  if (!categoriesList) {
    res.status(500).json({
      success: false,
    });
  }
  console.log(categoriesList)
  res.status(200).send(categoriesList);
});

router.get("/:id",authenticate, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(500).json({
      success: false,
      message: "Category not found",
    });
  }
  res.send(category);
});

router.post(`/`,authenticate, (req, res) => {
  const category = new Category({
    name: req.body.name
  });
  category
    .save()
    .then((category) => {
      res.status(201).json(category);
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
});

router.put(`/:id`,authenticate, async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!category) {
    res.status(500).json({
      success: false,
      message: "Category not found",
    });
  }
  res.send(category);
});

module.exports = router;
