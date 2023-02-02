// Requiring the module
const reader = require("xlsx");
const path = require("path");
let relativepath = process.cwd();

let absolutePath = path.resolve(relativepath + "\\Files\\UPC.xlsx");
function Read() {
  // Reading our test file
  const file = reader.readFile(absolutePath);

  let data = [];

  const sheets = file.SheetNames;

  for (let i = 0; i < 1; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      data.push(res);
    });
  }
  // Printing data
  return data;
}
function ReadUpcFile(number) {
  // Reading our test file
  const file = reader.readFile(
    "E:/UPC_PROJECT/fetcher-api/Files/UPC_" + number + ".xlsx"
  );

  let data = [];

  const sheets = file.SheetNames;

  for (let i = 0; i < 1; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      data.push(res);
    });
  }
  // Printing data
  return data;
}

function ReadUpcUrls() {
  // Reading our test file
  const file = reader.readFile(absolutePath);

  let data = [];
  const sheets = file.SheetNames;

  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[1]]);
  temp.forEach((res) => {
    data.push(res);
  });
  return data;
}

module.exports.Read = Read;
module.exports.ReadUpcFile = ReadUpcFile;
module.exports.ReadUpcUrls = ReadUpcUrls;
