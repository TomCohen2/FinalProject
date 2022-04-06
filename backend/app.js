const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const Card = require("./models/card");
const cardsRouter = require("./routers/cards");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
require("dotenv/config");

//middlewares
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());

//routes
const categoriesRoutes = require("./routers/categories");
// const productsRoutes = require("./routers/products");
const usersRoutes = require("./routers/users");
const ordersRoutes = require("./routers/orders");
const errorHandler = require("./helpers/error-handler");

const api = process.env.API_URL;
const CONNECTION_URL = process.env.CONNECTION_URL;

//use routes
app.use(`${api}/cards`, cardsRouter);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(errorHandler);

//connect to database
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(8000, () => {
  console.log(api);
  console.log("Server started on port 8000");
});
