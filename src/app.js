const puppeteer = require("puppeteer");
const { OUR_SITE } = require("./constants");
const downloadImages = require("./downloadImages");
const ownWaitFor = require("./delay");
const getImagesList = require("./getImagesList");

const run = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(OUR_SITE);
  await page.setViewport({ width: 1080, height: 1024 });
  const searchResultSelector = ".pv-img";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);
  await ownWaitFor(10000);

  const imagesList = await getImagesList(page);

  const totalDownloadedmages = await downloadImages(page, imagesList);
  console.log("----------------- DONE ---------------------");
  console.log("Downloaded images: ", totalDownloadedmages);
  browser.close();
};

module.exports = { run };
