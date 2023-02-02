// import logo from "./logo.svg";
// import "./App.css";
// import ReactDom from "react-dom";
// import { useState } from "react";
// import $, { post } from "jquery";
// const axios = require("axios");
const fetch = require("node-fetch");
// const { $ } = require("jquery");
// import { getCsv, getUrls } from "./Modules/Upc";
// import Homepage from "./Components/Homepage";
// import Connection from "./Components/Connection";

// const [data,setState]=useState([]);
// var promises=[];

var names = [];
var DetailArray = [];
var RemArray = [];

// // let response=null;
var response = [857318008279, 023663543561, 056389001787];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// var response = getCsv();
// var respUrls = getUrls();
// console.log(response.length);
async function makeReq() {
  for (var i = 0; i < response.length; i++) {
    await sleep(3000);
    Calling(i, response[i]);
  }
  //   for (var i = 0; i < DetailArray.length; i++) {
  //     sendData(DetailArray[i]);
  //   }

  //   printData();

  // for (var i = 0; i < 10; i++) {
  //   await sleep(3000);
  //   parseDetails(respUrls[i]);
  // }
  // for (var i = 0; i < DetailArray.length; i++) {
  //   sendData(DetailArray[i]);
  // }
  // printData();
}

// makeReq();

async function Calling(i, resp) {
  let url = "https://www.barcodelookup.com/" + resp;
  fetch(url)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  //   axios
  //     .get("https://www.barcodelookup.com/" + resp)
  //     .then((result) => {
  //       console.log(result.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   $.ajax({
  //     url: "https://www.barcodelookup.com/" + resp,
  //     type: "GET",
  //     async: false,
  //     success: function (result) {
  //       let name = "NA";
  //       let category = "NA";
  //       let description = "NA";
  //       let manufacturer = "NA";
  //       let EAN = "NA";
  //       let attributes = "";

  //       if (result != null || result != undefined || result != "") {
  //         const html = $.parseHTML(result);
  //         const $el = html[23];
  //         // const $ele=html[27];
  //         // console.log($el);
  //         try {
  //           // name=$el.children[2].children[0].children[0].children[1].children[2].innerText;
  //           name =
  //             $el.getElementsByClassName("product-details")[0].children[2]
  //               .innerText;
  //           var elementCount =
  //             $el.getElementsByClassName("product-details")[0].childElementCount;
  //           // if(elementCount == 8){
  //           for (var j = 5; j <= elementCount - 2; j++) {
  //             if (
  //               $el
  //                 .getElementsByClassName("product-details")[0]
  //                 .children[j].textContent.includes("Category")
  //             ) {
  //               category =
  //                 $el.getElementsByClassName("product-details")[0].children[j]
  //                   .children[0].innerText;
  //             }
  //             if (
  //               $el
  //                 .getElementsByClassName("product-details")[0]
  //                 .children[j].textContent.includes("Manufacturer")
  //             ) {
  //               manufacturer =
  //                 $el.getElementsByClassName("product-details")[0].children[j]
  //                   .children[0].innerText;
  //             }
  //           }
  //           // }
  //           description =
  //             $el.getElementsByClassName("product-meta-data")[0].children[0]
  //               .children[0].innerText;
  //           var liCount =
  //             $el.getElementById("product-attributes").childElementCount;
  //           for (var j = 0; j < liCount; j++) {
  //             attributes =
  //               $el.getElementById("product-attributes").children[j].children[0]
  //                 .innerText +
  //               "," +
  //               attributes;
  //           }
  //           // category=$el.children[2].children[0].children[0].children[1].children[4].children[0].children[1].children[0].children[0].children[0].innerText;
  //           // manufacturer=$el.children[2].children[0].children[0].children[1].children[4].children[0].children[2].children[0].children[0].children[0].innerText;
  //           // description = $ele.getElementsByClassName('product-text')[0].innerText;
  //           // EAN = $el.getElementsByClassName('product-details')[0].children[4].children[0].children[0].children[0].innerText;
  //           // EAN = EAN.substring(EAN.trim().length-13);
  //           name.replaceAll("\n", "");
  //           manufacturer.replaceAll("\n", "");
  //           description.replaceAll("\n", "");
  //           category.replaceAll("\n", "");
  //         } catch (err) {
  //           // console.log(err);
  //         }
  //       }
  //       var obj = {
  //         UPC: resp,
  //         NAME: name,
  //         CATEGORY: category,
  //         DESCRIPTION: description,
  //         MANUFACTURER: manufacturer,
  //         EAN: EAN,
  //         ATTRIBUTES: attributes,
  //       };
  //       DetailArray.push(obj);
  //       console.log(i + ":" + resp);
  //       // sendData(obj);
  //     },
  //     error: function (xhr, response) {
  //       // if (xhr.status == 429) {
  //       //   // var time = xhr.getResponseHeader('retry-after');
  //       //   RemArray.push(resp);
  //       // }
  //       // // console.log(response);
  //     },
  //   });
}

async function parseDetails(url) {
  let upcUrl = "https://www.jcpenney.com" + url.keywordRedirectUrl;
  $.ajax({
    url: upcUrl,
    type: "GET",
    async: false,
    success: function (result) {
      var doc = new DOMParser().parseFromString(result, "text/html");
      // doc.getElementById('productTitle-false').innerText
      let name = doc.getElementById("productTitle-false").innerText;
      let obj = {
        upcUrl: upcUrl,
        name: name,
      };
      names.push(obj);
    },
    error: function (err) {},
  });
}
var counter = RemArray.length - 1;

function printData() {
  console.log(DetailArray);
  console.log(RemArray);
  $.ajax({
    url: "http://localhost:4000/status",
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({ status: "ok" }),
    success: function (response) {
      console.log(response);
    },
  });
}
function sendData(obj) {
  $.ajax({
    url: "http://localhost:4000/details",
    async: false,
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(obj),
    success: function (response) {
      // console.log(response);
    },
    error: function (err) {
      // console.log(err);
    },
  });
}

module.exports.bcdLookup = makeReq;
