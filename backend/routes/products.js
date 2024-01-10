const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const { search = "", field = "", sort = "", page , paginate } = req.query;

  let offsetValue;
  // This query won't work in MariaDB if you are using XAMPP default setting (which MariaDB is auto-configured instead of MySQL)
  let query = `
  SELECT p.*,
    ( CASE
        WHEN pc.product_id IS NULL THEN NULL
        ELSE 
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
        )
      END ) 'categories'
    from products p
    left join product_category pc on p.id = pc.product_id
    left join categories c on pc.category_id = c.id
    GROUP BY p.id
  `;

  if (page > 0) {
    offsetValue = (page - 1)*paginate;
    query+=` LIMIT ${paginate} OFFSET ${offsetValue}`;
  } 
  else{
    if (paginate) query+=` LIMIT ${paginate}`;
  }
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
router.get("/get-one", async (req, res) => {
  const { productId } = req.query;
  db.query(
    `
    SELECT p.*,
    ( CASE
        WHEN pc.product_id IS NULL THEN NULL
        ELSE 
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
        )
      END   )  'categories'
    from products p
    left join product_category pc on p.id = pc.product_id
    left join categories c on pc.category_id = c.id
    where p.id = ${productId}
    GROUP BY p.id`,
    (err, results) => {
      if (err) console.log(err);
      else {
        res.json({
          data: results.length > 0 ? results.map(obj => {
            return { ...obj, categories: JSON.parse(obj.categories) };
        }).pop() : null,
          total: results ? results.length : 0
        });
      }
    }
  );
});

module.exports = router;
