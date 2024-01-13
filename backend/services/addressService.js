const db = require("../database/db");
const countryHelper = require("../helpers/countryHelper");
const stateHelper = require("../helpers/stateHelper");

exports.getAddressesByUserId = async (params) => {
  const userId = params;

  if (!userId) throw { message: "userId was not provided", statusCode: 400 };

  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM myapp.addresses where user_id = ${userId}`,
      (err, results) => {
        results = results.map(i => {
            i.country = countryHelper.getCountryById(i.country_id),
            i.state = stateHelper.getById(i.state_id)

            return i;
        });

        if (err) reject({ message: err, statusCode: 500 })
        else {
          resolve({
            statusCode: 200,
            data: results,
            total: results.length
          });
        }
      }
    );
  });
};
