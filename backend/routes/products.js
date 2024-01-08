const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const { search = "", field = "", sort = "", page = 1, paginate = 10 } = req.query;

  let startValue;
  let endValue;
  let offsetValue;

  if (page > 0) {
    startValue = page * paginate - paginate; // 0,10,20,30
    endValue = page * paginate;
    offsetValue = (page - 1)*paginate
  } else {
    startValue = 0;
    endValue = 10;
  } 

  let query = `SELECT * FROM products p LIMIT ${paginate} OFFSET ${offsetValue}`;
  
  db.query(
    query,
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

// GET SINGLE PRODUCT BY ID
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  db.query(
    `SELECT p.id, p.title, p.image, p.images, p.description, p.price, p.quantity, p.short_desc,
        c.title as category FROM products p JOIN categories c ON
            c.id = p.cat_id WHERE p.id = ${productId}`,
    (err, results) => {
      if (err) console.log(err);
      else res.json(results[0]);
    }
  );
});

module.exports = router;
