const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const config = require("./config");
//SCHEMAS
const Product = require("./models/product");
const Customer = require("./models/customer");
const Order = require("./models/order");

//ROTAS
const indexRoute = require("./routes/index-route");
const productRoute = require("./routes/product-route");
const customerRoute = require("./routes/customer-route");
const orderRoute = require("./routes/order-route");

const app = express();

app.use(bodyParser.json({ limit: "60mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "60mb" }));


mongoose.connect(config.connectionString);

app.use("/", indexRoute);
app.use("/products", productRoute);
app.use("/customer", customerRoute);
app.use("/order", orderRoute);

module.exports = app;
