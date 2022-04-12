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
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(500).json({
      success: false,
      message: "User not found",
    });
  }
  console.log(user);
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  let user = new User({
    // username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    address: req.body.address,
    latAndLong: req.body.latAndLong,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    profilePicture : "",
    coins: 0,
    rating: 0,
    document: "",
    verified: false,
    lastUpdate: Date.now(),
    createdAt: Date.now()
  });
  user = await user.save();
  if (!user) {
    return res.status(500).send("Error creating user");
  }
  return res.status(200).send(user);
});

router.put("/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return res.status(500).send("User not found");
  }
  const currentDetails = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    address: user.address,
    phone: user.phone,
    isAdmin: user.isAdmin,
    latAndLong: user.latAndLong,
    coins: user.coins,
    rating: user.rating,
    profilePicture: user.profilePicture,
    document: user.document,
    verified: user.verified
  };
  user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName || currentDetails.firstName,
      lastName: req.body.lastName || currentDetails.lastName,
      // email: currentDetails.email,
      // password: bcrypt.hashSync(req.body.password, 10) || currentDetails.password,
      address: req.body.address || currentDetails.address,
      phone: req.body.phone || currentDetails.phone,
      latAndLong: req.body.latAndLong || currentDetails.latAndLong,
      isAdmin: req.body.isAdmin || currentDetails.isAdmin,
      coins: req.body.coins || currentDetails.coins,
      rating: req.body.rating || currentDetails.rating ,
      profilePicutre: req.body.profilePicture || currentDetails.profilePicture,
      document: req.body.document || currentDetails.document,
      verified: req.body.verified || currentDetails.verified,
      lastUpdate: Date.now(),
    },
    { new: true }
  );

  if (!user) {
    return res.status(500).send("Error updating user");
  }
  user = await user.save();
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    });

  return res.status(200).send({
    email: user.email,
    token: token,
    id: user._id,
    isAdmin: user.isAdmin,
    lastName: user.lastName,
    firstName: user.firstName,
    address: user.address,
    phone: user.phone,
    latAndLong: user.latAndLong,
    coins: user.coins,
    rating: user.rating,
    profilePicture: user.profilePicture,
    document: user.document,
    verified: user.verified
  });
});



router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
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
      email: user.email,
      token: token,
      id: user._id,
      isAdmin: user.isAdmin,
      lastName: user.lastName,
      firstName: user.firstName,
      address: user.address,
      phone: user.phone,
      latAndLong: user.latAndLong,
      coins: user.coins,
      rating: user.rating,
      profilePicture: user.profilePicture,
      document: user.document,
      verified: user.verified
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
