#!/usr/bin/env node

const Tesseract = require("tesseract.js");
const axios = require("axios");

const BASE_URL = "https://www.vpnbook.com";

async function resolvePasswordImageRelativeUrl(vpnBookUrl) {
  const { data: html } = await axios.get(vpnBookUrl);
  const start = html.indexOf('src="password.php');
  const end = html.indexOf(">", start);
  const sliced = html.slice(start, end);

  const urlStart = sliced.indexOf('"');
  const urlEnd = sliced.indexOf('"', start);
  const link = sliced
    .slice(urlStart, urlEnd)
    .replace(new RegExp('"', "g"), "")
    .trim();

  return link;
}

async function imageToText(imageUrl) {
  const { data } = await Tesseract.recognize(imageUrl, "eng", {
    cacheMethod: "readOnly",
    logger: () => {}
  });

  return data.text.trim();
}

(async () => {
  const passwordImageUrl = await resolvePasswordImageRelativeUrl(BASE_URL);

  const url = encodeURI(`${BASE_URL}/${passwordImageUrl}`);

  const password = await imageToText(url);

  console.log(`Username: "vpnbook"`);
  console.log(`Password: "${password}"`);
})();
