const express = require("express");
const router = express.Router();
const Category = require("../models/category");

router.get(`/`, async (req, res) => {
  const categoriesList = await Category.find();
  if (!categoriesList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(categoriesList);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(500).json({
      success: false,
      message: "Category not found",
    });
  }
  res.send(category);
});

router.post(`/`, (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
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

router.put(`/:id`, async (req, res) => {
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

router.delete(`/:id`, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(500).json({
      success: false,
    });
  }
  category.remove();
  res.status(200).json({
    success: true,
  });
});

module.exports = router;
