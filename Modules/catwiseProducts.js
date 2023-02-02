const pages_count = 25;
const axios = require("axios");
const { writeProducts } = require("../Modules/WriteUpcDetails");

const fetchCategoryWiseData = async () => {
  for (var i = 0; i < pages_count; i++) {
    let product_url = `https://search-api.jcpenney.com/v1/search-service/g/men/mens-shirts?productGridView=medium&id=cat100240025&page=${i}&responseType=organic`;
    await axios
      .get(product_url)
      .then(async (resp) => {
        writeProducts(resp.data.organicZoneInfo.products);
        console.log(i);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

module.exports.fetchCategoryWiseData = fetchCategoryWiseData;
