const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const { search = "", field = "", sort = "", page , paginate } = req.query;

  let offsetValue;
  // This query won't work in MariaDB if you are using XAMPP default setting (which MariaDB is auto-configured instead of MySQL)
  let query = `SELECT p.*,
                JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'id', c.id, 
                    'name', c.name, 
                    'slug', c.slug, 
                    'description', c.description, 
                    'status', c.status, 
                    'parent_id', c.parent_id, 
                    'type', c.type, 
                    'category_image_id', c.category_image_id, 
                    'category_icon_id', c.category_icon_id
                  )
                ) AS 'categories'
              from products p
              inner join product_category pc on p.id = pc.product_id
              inner join categories c on pc.category_id = c.id
              GROUP BY p.id `;//LIMIT ${paginate} OFFSET ${offsetValue}

  if (page > 0) {
    offsetValue = (page - 1)*paginate;
    query+=` LIMIT ${paginate} OFFSET ${offsetValue}`;
  } 
  // else {
  //   query+=` LIMIT 100`;
  // } 

  // console.log(query);
  // var fs=require('fs');
  // var data=fs.readFileSync('./product.json', 'utf8');
  // var words=JSON.parse(data);
  // res.json(words)
  db.query(
    query,
    (err, results) => {
      if (err) console.log(err);
      else{
        
        res.json({
          data: results.map(obj => {
            return { ...obj, categories: JSON.parse(obj.categories) };
        }),
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
