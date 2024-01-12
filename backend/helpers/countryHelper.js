let countryLib = (function () {

    var fs = require('fs');
    var data = fs.readFileSync('./static_data/country.json', 'utf8');
    var results = JSON.parse(data);

    function getAllCountry() {
        return results;
    }

    function getCountryById(id) {
        return results.find(i => i.id == id);
    }

})();
module.exports = countryLib;

