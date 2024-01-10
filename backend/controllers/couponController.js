const {
    getOrders,
    getSingleOrder,
    createOrder,
} = require("../services/orderService");
const couponService = require('../services/couponService');

exports.create_order = async (req, res, next) => {
    const {userId, cart} = req.body;
    createOrder({userId, cart})
        .then((result) => {
            res.status(result.statusCode).send({...result});
        })
        .catch((err) => {
            const {statusCode = 400, message} = err;
            res.status(statusCode).send({message}) && next(err);
        });
};

exports.get_single_order = async (req, res, next) => {
    const {orderId, userId} = req.query;
    getSingleOrder({orderId, userId})
        .then((result) => {
            const {message, data} = result;
            res.status(200).send({message, data});
        })
        .catch((err) => {
            const {statusCode = 400, message} = err;
            res.status(statusCode).send({message}) && next(err);
        });
};

exports.get_orders = async (req, res, next) => {
    const {userId} = req.query;
    getOrders({userId})
        .then((result) => {
            const {message, data} = result;
            res.status(200).send({message, data});
        })
        .catch((err) => {
            const {statusCode = 400, message} = err;
            res.status(statusCode).send({message}) && next(err);
        });
};

exports.get_all_coupons = (req, res) => {
    const { id } = req.params;

    couponService.getAllCoupons()
        .then(result => {
            const {data, total} = result;
            res.json({ data, total });
        })
        .catch(error => {
            res.status(500).json(error);
        });
};

exports.get_coupon_by_id = (req, res) => {
    const { id } = req.params;

    couponService.getCouponById(id)
        .then(result => {
            res.json({ data: result });
        })
        .catch(error => {
            res.status(500).json(error);
        });
};

exports.create_coupon = (req, res) => {
    const couponData = req.body; // Giả sử thông tin coupon được gửi trong body của request

    couponService.createCoupon(couponData)
        .then(result => {
            res.status(result.statusCode).json(result);
        })
        .catch(error => {
            res.status(error.statusCode || 500).json(error);
        });
};

exports.delete_coupon = async (req, res) => {
    const { id } = req.params;

    couponService.deleteCoupon(id)
        .then(result => {
            res.json({ data: result });
        })
        .catch(error => {
            res.status(500).json(error);
        });
}