const db = require("../database/db");
const countryHelper = require("../helpers/countryHelper");
const stateHelper = require("../helpers/stateHelper");

exports.getAddressesByUserId = async (params) => {
  const userId = params;

  if (!userId) throw { message: "userId was not provided", statusCode: 400 };

  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM myapp.addresses where user_id = ${userId}`, (err, results) => {
      results = results.map(i => {
        i.country = countryHelper.getCountryById(i.country_id), i.state = stateHelper.getById(i.state_id)

        return i;
      });

      if (err) reject({ message: err, statusCode: 500 })
      else {
        resolve({
          statusCode: 200, data: results, total: results.length
        });
      }
    });
  });
};

// exports.getAllAddresses = () => {
//   return new Promise((resolve, reject) => {
//     db.query(`SELECT * FROM addresses`, (err, result) => {
//       if (err) {
//         console.log(err);
//         reject({ error: "Internal Server Error" });
//       } else {
//         resolve({ data: result, total: result.length });
//       }
//     });
//   });
// }

exports.getAddressById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM addresses WHERE id = ${id}`, (err, result) => {
      if (err) {
        console.log(err);
        reject({ error: "Internal Server Error" });
      } else {
        if (result.length === 0) {
          reject({
            message: "Wrong credentials, please try again",
            statusCode: 400,
          });
        }
        results = results.map(i => {
          i.country = countryHelper.getCountryById(i.country_id), i.state = stateHelper.getById(i.state_id)
  
          return i;
        });
        resolve({
          statusCode: 200, data: results, total: results.length
        });
        // resolve(result[0]);
      }
    });
  });
}

exports.createAddress = (addressData) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO addresses SET line1 = ?,
        line2 = ?,
        city = ?,
        street_name = ?,
        country = ?,
        phone = ?,
        pincode = ?,
        user_id = ?,
        title = ?,
        street = ?,
        country_id = ?,
        is_default = ?,
        type = ?,
        state_id = ?`;
    db.query(sqlQuery,
      [addressData.line1,
      addressData.line2,
      addressData.city,
      addressData.street_name,
      addressData.country,
      addressData.phone,
      addressData.pincode,
      addressData.user_id,
      addressData.title,
      addressData.street,
      addressData.country_id,
      addressData.is_default,
      addressData.type,
      addressData.state_id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          reject({ error: "Internal Server Error", msg: err.sqlMessage });
        } else {
          resolve({ data: result });
        }
      });
  });
}

exports.updateAddress = (id, addressData) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `UPDATE addresses SET line1 = ?, line2 = ?, city = ?, street_name = ?, country = ?, phone = ?, pincode = ?, user_id = ?, title = ?, street = ?, country_id = ?, is_default = ?, type = ?, state_id = ? WHERE id = ?`;

    db.query(sqlQuery,
      [addressData.line1, addressData.line2, addressData.city, addressData.street_name, addressData.country, addressData.phone, addressData.pincode, addressData.user_id, addressData.title, addressData.street, addressData.country_id, addressData.is_default, addressData.type, addressData.state_id, id],
      (err, result) => {
        if (err) {
          console.log(err);
          reject({ message: err, statusCode: 500 });
        } else {
          resolve({ message: "Address updated successfully", data: result, statusCode: 200 });
        }
      });
  });
}

exports.deleteAddress = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM addresses WHERE id = ?`, [id], (err, result) => {
      if (err) {
        console.log(err);
        reject({ error: err });
      } else {
        resolve({ data: result });
      }
    });
  });
}