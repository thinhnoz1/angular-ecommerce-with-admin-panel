const express = require('express');
const router = express.Router();
const couponController = require("../controllers/couponController");
const db = require("../database/db");

router.get("/", couponController.get_all_coupons);

router.post("/create", couponController.create_coupon);

router.get("/read/:id", couponController.get_coupon_by_id);

router.get("/delete/:id", couponController.delete_coupon);

module.exports = router;