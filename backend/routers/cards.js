const express = require("express");
const router = express.Router();
const Card = require("../models/card");
const Category = require("../models/category");
const authenticate = require("../helpers/auth");
const {updateCard, getAllCards,getAllCardsById,getCardById, addCard}=require('../controllers/cards-controllers');

/**
* @swagger
* tags:
*   name: Card Api
*   description: The Card API
*/

/**
* @swagger
* components:
*   schemas:
*     Card:
*       type: object
*       required:
*         - price
*         - value
*         - cardNumber
*         - expirationDate
*         - cardType
*         - owner
*       properties:
*         price:
*           type: number
*           description: The price
*         value:
*           type: number
*           description: The value
*         cardNumber:
*           type: string
*           description: The cardNumber
*         expirationDate:
*           type: number
*           description: The expirationDate
*         cardType:
*           type: object
*           description: The cardType
*         owner:
*           type: object
*           description: The owner
*       example:
*         message: 'this is swagger test message'
*         sender: '123456'
*/


/**
* @swagger
* /api/v1/cards:
*   get:
*     summary: get all posts
*     tags: [Card Api]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The posts list
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Card'
*/


router.get(`/`, authenticate, getAllCards);

router.get(`/owner/:id`, authenticate, getAllCardsById);


router.get("/:id", authenticate, getCardById);


router.post(`/`, authenticate, addCard);

router.put(`/:id`, authenticate, updateCard);

module.exports = router;
