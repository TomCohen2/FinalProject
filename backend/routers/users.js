const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../helpers/auth");


router.get(`/`, authenticate , async (req, res) => {
  const usersList = await User.find().select("-password");
  if (!usersList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(usersList);
});

router.get("/:id", authenticate, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(500).json({
      success: false,
      message: "User not found",
    });
  }
  // console.log(user);
  res.status(200).send(user);
});

// this is signup
router.post("/", async (req, res) => {
  const u = await User.findOne({ email: req.body.email });
  if (u) {
    return res.status(401).send("Email already Exists");
  }

  let user = new User({
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
    createdAt: Date.now(),
    tokens : []
  });

  user = await user.save();
  if (!user) {
    return res.status(500).send("Error creating user");
  }
  return res.status(200).send(user);
});

router.put("/:id",authenticate, async (req, res) => {
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
      profilePicture: req.body.profilePicture || currentDetails.profilePicture,
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

  return res.status(200).send({
    email: user.email,
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

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  const passwordValid = bcrypt.compareSync(req.body.password, user.password);
  if (user && passwordValid) {
    const accesstoken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign({id:user._id}, process.env.JWT_REFRESH_SECRET)
    if (user.tokens == null) user.tokens = [refreshToken]
    else user.tokens.push(refreshToken)
    await user.save()

    return res.status(200).send({
      email: user.email,
      accessToken: accesstoken,
      refreshToken: refreshToken,
      password: user.password,
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

router.post("/refreshToken/:id", (req, res) => {
  authHeaders = req.headers['authorization']
  const token = authHeaders && authHeaders.split(' ')[1]
  if (token == null) return res.sendStatus('401')
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err,userInfo)=>{
    if (err) return res.status(403).send(err.message)
    const userId = req.params.id
    try{
      let user = await User.findById(userId)
      if (user == null) return res.status(403).send('invalid Request')
      if(!user.tokens.includes(token)){
        user.tokens = []
        await user.save()
        return res.status(403).send('invalid Request')
      }

      const accesstoken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXP,
        }
      );

      const refreshToken = jwt.sign({id:user._id}, process.env.JWT_REFRESH_SECRET)
      user.tokens[user.tokens.indexOf(token)] = refreshToken
      await user.save()

      res.status(200).send({
        email: user.email,
        accessToken: accesstoken,
        refreshToken: refreshToken,
        password: user.password,
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
      })

      }catch (err){
        res.status(403).send(err.message)
      }
    })
})

router.post("/logout/:id", (req, res) => {
  authHeaders = req.headers['authorization']
  const token = authHeaders && authHeaders.split(' ')[1]
  if (token == null) return res.sendStatus('401')
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err,userInfo)=>{
    if (err) return res.status(403).send(err.message)
    const userId = req.params.id
    try{
      let user = await User.findById(userId)
      if (user == null) return res.status(403).send('invalid Request')
      if(!user.tokens.includes(token)){
        user.tokens = []
        await user.save()
        return res.status(403).send('invalid Request')
      }
      user.tokens.splice(user.tokens.indexOf(token),1)
      await user.save()
      res.status(200).send();

    }catch (err){
      res.status(403).send(err.message)
    }

  })
  }
)


const addCoinToUser = async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) res.status(500).send("user not found")
  if (!req.body.coins) res.status(400).send("Need coins in body Request")
  user.coins += req.body.coins
  user.lastUpdate = Date.now()
  user = await user.save();
  if (!user) {
    return res.status(500).send("Error creating user");
  }
    return res.status(200).send(user);
  }

router.post("/coins/:id", authenticate, addCoinToUser)

router.post("/authenticate", async (req,res)=>{
  authHeaders = req.headers['authorization']
  const token = authHeaders && authHeaders.split(' ')[1]
  if (token == null) return res.sendStatus('401')
  jwt.verify(token,process.env.JWT_SECRET, (err,user)=>{
      if (err) return res.status(403).send(false)
      else return res.status(200).send(true)
    })
  }
)
module.exports = router;