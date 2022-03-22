const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  const usersList = await User.find().select("-password");
  if (!usersList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(usersList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(500).json({
      success: false,
      message: "User not found",
    });
  }
  res.send(user);
});

router.post("/", async (req, res) => {
  let user = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    address: req.body.address,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();
  if (!user) {
    return res.status(500).send("Error creating user");
  }
  return res.status(201).send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  const passwordValid = bcrypt.compareSync(req.body.password, user.password);
  if (user && passwordValid) {
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).send({
      user: user.email,
      token: token,
    });
  } else {
    return res.status(401).send("Invalid email or password");
  }
});

router.get("/get/count", async (req, res) => {
  const usersCount = await User.countDocuments();
  if (!usersCount) {
    res.status(500).json({
      success: false,
      message: "Count not found",
    });
  }
  res.send({ usersCount: usersCount });
});

router.delete(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(500).json({
      success: false,
    });
  }
  user.remove();
  res.status(200).json({
    success: true,
  });
});
module.exports = router;
