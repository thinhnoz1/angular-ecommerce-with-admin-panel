const express = require("express");
const router = express.Router();
const db = require("../database/db");

var fs = require('fs');
var data = fs.readFileSync('./static_data/country.json', 'utf8');
var results = JSON.parse(data);

function getAllCountry() {
  return results;
}

function getCountryById(id) {
  return results.find(i => i.id == id);
}

// GET ALL Country
router.get("/", async (req, res) => {
  // debugger
  res.json({
    data: getAllCountry()
  });
});

// GET ALL Country
router.get("/get-one", async (req, res) => {
  const { id } = req.query;
  res.json({
    data: getAllCountry(id)
  });
}); 


module.exports = router;
