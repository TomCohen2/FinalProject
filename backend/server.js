const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const user = require("./models/user");
const card = require("./models/card");
const coinTransaction = require("./models/coinTransaction");
const cardType = require("./models/cardType");
// const cardTransaction = require("./models/cardTransaction");
const cors = require("cors");
require("dotenv/config");

//middlewares
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));

//routes
const categoriesRoutes = require("./routers/categories");
const cardsRoutes = require("./routers/cards");
const usersRoutes = require("./routers/users");
const coinTransactionsRoutes = require("./routers/coinTransactions");
const cardTypesRoutes = require("./routers/cardTypes");
// const cardTransactionsRoutes = require("./routers/cardTransactions");

const api = process.env.API_URL;
const CONNECTION_URL = process.env.CONNECTION_URL;

//use routes
app.use(`${api}/cards`, cardsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/coinTransactions`, coinTransactionsRoutes);
app.use(`${api}/cardTypes`, cardTypesRoutes);
// app.use(`${api}/cardTransactions`, cardTransactionsRoutes);
app.use(`${api}/users`, usersRoutes);

//connect to database
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;