const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET ALL Images
router.get("/", async (req, res) => {
  // This query won't work in MariaDB if you are using XAMPP default setting (MariaDB is auto-configured instead of MySQL)
  let query = `select * from images`;

  db.query(
    query,
    (err, results) => {
      if (err) console.log(err);
      else{
        
        res.json({
          data: results
        });
      } 
    }
  );
});


module.exports = router;
