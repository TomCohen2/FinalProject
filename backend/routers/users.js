const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authenticate = require('../helpers/auth')
const {
  signup,
  login,
  getAllUsers,
  findUserById,
  addCoinToUser,
  logout,
  countUser,
  updateUser,
} = require('../controllers/users-controllers')

/**
 * @swagger
 * tags:
 *   name: User Api
 *   description: The User API
 */

/**
 * @swagger
 * components:
 *     securitySchemes:
 *        bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - password
 *         - email
 *         - firstName
 *         - lastName
 *         - phone
 *         - address
 *         - latAndLong
 *       properties:
 *         password:
 *           type: string
 *           description: The password
 *         email:
 *           type: string
 *           description: The email
 *         firstName:
 *           type: string
 *           description: The firstName
 *         lastName:
 *           type: string
 *           description: The lastName
 *         phone:
 *           type: string
 *           description: The phone
 *         address:
 *           type: string
 *           description: The address
 *         latAndLong:
 *           type: string
 *           description: The latAndLong
 *       example:
 *         email: 'swagger@test.com'
 *         password: 'swagger'
 */

router.get(`/`, authenticate, getAllUsers)

router.get('/:id', authenticate, findUserById)

router.post('/', signup)

router.put('/:id', authenticate, updateUser)

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: add new post
 *     tags: [User Api]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: sign-in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.post('/login', login)

router.get('/get/count', countUser)

router.post('/refreshToken/:id', (req, res) => {
  authHeaders = req.headers['authorization']
  const token = authHeaders && authHeaders.split(' ')[1]
  if (token == null) return res.sendStatus('401')
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, userInfo) => {
    if (err) return res.status(403).send(err.message)
    const userId = req.params.id
    try {
      let user = await User.findById(userId)
      if (user == null) return res.status(403).send('invalid Request')
      if (!user.tokens.includes(token)) {
        user.tokens = []
        await user.save()
        return res.status(403).send('invalid Request')
      }

      const accesstoken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXP,
        },
      )

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
      )
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
        verified: user.verified,
      })
    } catch (err) {
      res.status(403).send(err.message)
    }
  })
})

router.post('/logout/:id', logout)

router.post('/coins/:id', authenticate, addCoinToUser)

router.post('/email_check', async (req, res) => {
  const u = await User.findOne({ email: req.body.email })
  if (u) {
    return res.status(200).send({
      email_exists: true,
    })
  } else return res.status(200).send({ email_exists: false })
})

router.post('/authenticate', async (req, res) => {
  authHeaders = req.headers['authorization']
  const token = authHeaders && authHeaders.split(' ')[1]
  if (token == null) return res.sendStatus('401')
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send(false)
    else return res.status(200).send(true)
  })
})

router.put('/addOne/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  const favObj = user.favorites.toObject({getters: true, flattenMaps: true});
  const count = user.favorites.get(req.body.category);
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      favorites: {...favObj,
        [req.body.category]: count
          ? count + 1
          : 1,
      },
    },
  )

  if (!updatedUser) {
    res.status(500).json({
      success: false,
      message: 'Category not found',
    })
  }
  res.send(updatedUser)
})

module.exports = router
