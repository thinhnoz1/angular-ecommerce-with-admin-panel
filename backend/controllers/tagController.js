const {
  getOrders,
  getSingleOrder,
  createOrder,
} = require("../services/orderService");
const tagService = require("../services/tagService");

exports.create_order = async (req, res, next) => {
  const { userId, cart } = req.body;
  createOrder({ userId, cart })
    .then((result) => {
      res.status(result.statusCode).send({ ...result });
    })
    .catch((err) => {
      const { statusCode = 400, message } = err;
      res.status(statusCode).send({ message }) && next(err);
    });
};

exports.get_single_order = async (req, res, next) => {
  const { orderId, userId } = req.query;
  getSingleOrder({ orderId, userId })
    .then((result) => {
      const { message, data } = result;
      res.status(200).send({ message, data });
    })
    .catch((err) => {
      const { statusCode = 400, message } = err;
      res.status(statusCode).send({ message }) && next(err);
    });
};

exports.get_orders = async (req, res, next) => {
  const { userId } = req.query;
  getOrders({ userId })
    .then((result) => {
      const { message, data } = result;
      res.status(200).send({ message, data });
    })
    .catch((err) => {
      const { statusCode = 400, message } = err;
      res.status(statusCode).send({ message }) && next(err);
    });
};

exports.get_all_tags = (req, res) => {

  tagService.getAllTags()
      .then(result => {
        const {data, total} = result;
        res.json({ data, total });
      })
      .catch(error => {
        res.status(500).json(error);
      });
};

exports.get_tag_by_id = (req, res) => {
  const { id } = req.params;

  tagService.getTagById(id)
      .then(result => {
        res.json({ data: result });
      })
      .catch(error => {
        res.status(500).json(error);
      });
};

exports.create_tag = (req, res) => {
  const tagData = req.body; // Giả sử thông tin coupon được gửi trong body của request

  tagService.createTag(tagData)
      .then(result => {
        res.status(result.statusCode).json(result);
      })
      .catch(error => {
        res.status(error.statusCode || 500).json(error);
      });
};

exports.delete_tag = async (req, res) => {
  const { id } = req.params;

  tagService.deleteTag(id)
      .then(result => {
        res.json({ data: result });
      })
      .catch(error => {
        res.status(500).json(error);
      });
}