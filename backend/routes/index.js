const express = require("express");
const router = express.Router();

const authRoute = require("./auth");
const usersRoute = require("./users");
const productsRoute = require("./products");
const categoriesRoute = require("./categories");
const ordersRoute = require("./orders");
const imagesRoute = require("./images");

router.use("/api/v1/auth", authRoute);
router.use("/api/v1/users", usersRoute);
router.use("/api/v1/products", productsRoute);
router.use("/api/v1/categories", categoriesRoute);
router.use("/api/v1/orders", ordersRoute);
router.use("/api/v1/images", imagesRoute);

module.exports = router;
