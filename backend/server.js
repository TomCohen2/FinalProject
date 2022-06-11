const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const user = require("./models/user");
const card = require("./models/card");
const coinTransaction = require("./models/coinTransaction");
const cardType = require("./models/cardType");
const cardTransaction = require("./models/cardTransaction");
const rating = require("./models/rating");
const cors = require("cors");
require("dotenv/config");

//middlewares

if (process.env.NODE_ENV == "development") {
  const swaggerUI = require("swagger-ui-express")
  const swaggerJsDoc = require("swagger-jsdoc")
  const options = {
      definition: {
          openapi: "3.0.0",
          info: {
              title: "AnyGift API",
              version: "1.0.0",
              description: "A simple Express API",
          },
          servers: [{url: "http://localhost:" + process.env.PORT,},],
      },
      apis: ["./routers/*.js"],
     
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));

//routes
const categoriesRoutes = require("./routers/categories");
const cardsRoutes = require("./routers/cards");
const usersRoutes = require("./routers/users");
const imagesRoutes = require("./routers/images");
const ratingsRoutes = require("./routers/ratings");
const coinTransactionsRoutes = require("./routers/coinTransactions");
const cardTypesRoutes = require("./routers/cardTypes");
const cardTransactionsRoutes = require("./routers/cardTransactions");
const userClicksRoutes=require("./routers/userClicks");

const api = process.env.API_URL;
const CONNECTION_URL = process.env.CONNECTION_URL;

//use routes
app.use(`${api}/cards`, cardsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/coinTransactions`, coinTransactionsRoutes);
app.use(`${api}/cardTypes`, cardTypesRoutes);
app.use(`${api}/cardTransactions`, cardTransactionsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/images`, imagesRoutes);
app.use(`${api}/ratings`, ratingsRoutes);
app.use(`${api}/userClicks`, userClicksRoutes);

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
