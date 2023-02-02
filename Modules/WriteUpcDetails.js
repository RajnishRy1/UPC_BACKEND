// Requiring module
const reader = require("xlsx");
const path = require("path");
var count = Math.floor(Math.random() * 100) + 10;
var Mens_Page = 100;
let relativepath = process.cwd();

let absolutePath = path.resolve(relativepath + "\\Files\\UPC.xlsx");
// Reading our test file
function writeUpcJCPenny(data) {
  const file = reader.readFile(absolutePath);

  const ws = reader.utils.json_to_sheet(data);
  count++;
  reader.utils.book_append_sheet(file, ws, "RawDataJCPenny");

  // Writing to our file
  reader.writeFile(file, absolutePath);
}
function writeUpcBarcodeLookup(data) {
  const file = reader.readFile(absolutePath);

  const ws = reader.utils.json_to_sheet(data);
  count++;
  reader.utils.book_append_sheet(file, ws, "RawDataBarcodeLookup");

  // Writing to our file
  reader.writeFile(file, absolutePath);
}

function WriteUpcUrls(data) {
  const file = reader.readFile(absolutePath);

  const ws = reader.utils.json_to_sheet(data);
  reader.utils.book_append_sheet(file, ws, "UpcUrls");

  // Writing to our file
  reader.writeFile(file, absolutePath);
}

function writeProducts(data) {
  const file = reader.readFile(
    "E:/UPC_PROJECT/fetcher-api/Files/Mens_Shirts.xlsx"
  );

  const ws = reader.utils.json_to_sheet(data);
  ++Mens_Page;
  reader.utils.book_append_sheet(file, ws, "Mens_Shirts" + Mens_Page);

  // Writing to our file
  reader.writeFile(file, "E:/UPC_PROJECT/fetcher-api/Files/Mens_Shirts.xlsx");
}

module.exports.writeUpcUrls = WriteUpcUrls;
module.exports.writeProducts = writeProducts;
module.exports.writeUpcBarcodeLookup = writeUpcBarcodeLookup;
module.exports.writeUpcJCPenny = writeUpcJCPenny;
