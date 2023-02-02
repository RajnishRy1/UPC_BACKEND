const { json } = require("express");
const express = require("express");
const multer = require("multer");
const { Read, ReadUpcUrls, ReadUpcFile } = require("./Modules/ReadUpcDetails");
const {
  writeUpcJCPenny,
  writeUpcBarcodeLookup,
  writeUpcUrls,
  writeUpc,
} = require("./Modules/WriteUpcDetails");

const fs = require("fs");

const { fetchCategoryWiseData } = require("./Modules/catwiseProducts");

const axios = require("axios");
const jsdom = require("jsdom");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + ".xlsx");
  },
});
const upload = multer({ storage: storage });

const app = express();
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let data;
let Arr = [];
let jcPennyDetails = { data: [] };
let barcodeLookupDetails = { data: [] };
// data.forEach((el) => Arr.push(el.UPC));
var response = Arr;

// let digit6 = new ReadUpcFile(6);
// let digit7 = new ReadUpcFile(7);
// let digit13 = new ReadUpcFile(13);
// let Array6 = [];
// let Array7 = [];
// let Array13 = [];
// digit6.forEach((el) => Array6.push(el.UPC));
// digit7.forEach((el) => Array7.push(el.UPC));
// digit13.forEach((el) => Array13.push(el.UPC));
app.get("/download", (req, res) => {
  res.download("./Files/UPC.xlsx");
});
app.get("/upcs", (req, res) => {
  data = Read();
  Arr = [];
  data.forEach((el) => Arr.push(el.UPC));
  try {
    res.send(Arr).status(200);
  } catch (err) {
    console.log(err);
  }
});

app.get("/deletefile", (req, res) => {
  fs.unlinkSync("Files/UPC.xlsx");
  res.status(200).send();
});
app.get("/upcurls", (req, res) => {
  try {
    res.send(ReadUpcUrls()).status(200);
  } catch (err) {
    console.log(err);
  }
});

app.post("/details", (req, res) => {
  if (req.body == undefined || req.body == null) {
    console.log("Empty Array");
    res.status(200).send();
  } else {
    // console.log('Success!')
    try {
      barcodeLookupDetails.data.push(req.body);
      // console.log(req.body);
      // writeUpc(details.data);
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(200).send();
    }
  }
});

app.get("/status", (req, res) => {
  console.log("ok");
  try {
    writeUpcBarcodeLookup(barcodeLookupDetails.data);
  } catch (err) {
    res.status(400).send(err);
  }
  res.status(200).send();
  console.log("done !");
});

app.post("/upload", upload.single("UPC"), (req, res) => {
  console.log(req.body);
  res.status(200).send();
});

app.get("/start", (req, res) => {
  data = Read();
  data.forEach((el) => Arr.push(el.UPC));
  response = Arr;
  // makeReq();
  bcdLookup();
  res.status(200).send();
});

app.listen(4000, () => {
  console.log("Listening on port 4000..");
});

// var response = [1010252010201, 8450810050410, 883449709846];
// var response = Arr;

const returnProgress = (length, index) => {
  let current = index / 2;
  return Math.round((current / length) * 100);
};

async function makeReq() {
  for (var i = 0; i < response.length; i++) {
    // await sleep(300);
    await Calling(i, response[i]);
    let progress = returnProgress(response.length, i);
    clients[Object.keys(clients)[0]].sendUTF(
      JSON.stringify({ progress: progress })
    );
  }
  console.log("writing Sheet...");
  writeUpcUrls(jcPennyDetails.data);
  console.log("Done!");
  console.log(
    "==========================================================================================="
  );
  let upcUrls = ReadUpcUrls();
  for (var i = 0; i < upcUrls.length; i++) {
    if (upcUrls[i].keywordRedirectUrl != undefined) {
      // await sleep(1000);
      await parseDetails(i, upcUrls[i]);
    } else {
      console.log(i + "= undefined");
    }
    let progress = returnProgress(response.length, response.length + i);
    clients[Object.keys(clients)[0]].sendUTF(
      JSON.stringify({ progress: progress })
    );
  }
  writeUpcJCPenny(names);
  console.log(
    "==========================================================================================="
  );
  console.log("data Fetched");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//for jc penny url's
async function Calling(i, resp) {
  resp = parseInt(resp);
  await axios
    .get(
      "https://search-api.jcpenney.com/v1/search-service/s?productGridView=medium&searchTerm=" +
        resp +
        "&responseType=organic"
    )
    .then(async (result) => {
      let obj = {
        upc: resp,
        keywordRedirectUrl: result.data.keywordRedirectUrl,
      };
      console.log(i + ":" + resp);
      jcPennyDetails.data.push(obj);
    })
    .catch((error) => console.log("error", error));
}
var names = [];

//for jc penny url's data
async function parseDetails(srNo, url) {
  let upcUrl = "https://www.jcpenney.com" + url.keywordRedirectUrl;
  await axios
    .get(upcUrl)
    .then((result) => {
      // var doc = new DOMParser().parseFromString(result, "text/html");
      // doc.getElementById('productTitle-false').innerText
      let price = "na";
      const doc = new jsdom.JSDOM(result.data);
      let name =
        doc.window.document.getElementById("productTitle-false").textContent;
      console.log(srNo + "=" + name);
      if (doc.window.document.querySelectorAll(".YOMPJ")[13] != undefined) {
        price =
          doc.window.document.querySelectorAll(".YOMPJ")[13].children[0]
            .innerText;
      }
      let productDetails = JSON.parse(
        "{" +
          result.data.substring(
            result.data.indexOf('"productDetails":'),
            result.data.indexOf(',"productOptions":')
          ) +
          "}"
      );
      let description = productDetails.productDetails.lots[0].description;
      let obj = {
        UPC: url.upc,
        upcUrl: upcUrl,
        name: name,
        description: description,
      };
      names.push(obj);
    })
    .catch((err) => {
      console.log(err);
    });
}

// makeReq();

// fetchCategoryWiseData();

const webSocketsServerPort = 8000;
const WebSocketServer = require("websocket").server;
const http = require("http");
const { bcdLookup } = require("./Modules/barcodeLookup");
const server = http.createServer();
server.listen(webSocketsServerPort);

const clients = {};

const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

const wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on("request", function (request) {
  var userId = getUniqueID();
  console.log("new request" + request.origin);
  const connection = request.accept(null, request.origin);
  clients[userId] = connection;
});
