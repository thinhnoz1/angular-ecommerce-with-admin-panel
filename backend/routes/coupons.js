const express = require('express');
const router = express.Router();
const couponController = require("../controllers/couponController");
const db = require("../database/db");

router.get("/", couponController.get_all_coupons);
router.get("/", async (req, res) => {
    db.query(
        `SELECT * FROM coupons LIMIT 10`,
        (err, results) => {
            if (err) console.log(err);
            else{
                res.json({
                    data: results,
                    total: results ? results.length : 0
                });
            }
        }
    );
});
// Endpoint để lấy thông tin coupon theo ID

router.get("/:id", couponController.get_coupon_by_id);
// router.get("/:id", async (req, res) => {
//     const {id} = req.params;
//     db.query(
//         `SELECT * FROM coupons WHERE id = ${id}`,
//         (err, result) => {
//             if (err) console.log(err);
//             else{
//                 res.json({
//                     data: result[0],
//                 })
//             }
//         }
//     )
// });

module.exports = router;