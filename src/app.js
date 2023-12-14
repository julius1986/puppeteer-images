const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const OUR_SITE = "https://www.pravadaphotography.com/val_juanwedding";

const images = [];

const imagesCount = 20;

const uniqueImages = new Set();

const DOWNLOAD_DIR = "./src/downloads";

const ownWaitFor = (msec = 300) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, msec);
  });

const findImages = async (page) => {
  const elementArrayData = await page.$$eval(
    "#qs-slideshow img",
    (elements) => {
      return elements.map((element) => {
        return {
          src: element.src,
        };
      });
    }
  );
  return elementArrayData;
};

const downloadImages = async (page) => {
  let i = imagesCount;
  while (i > 0) {
    i--;
    await ownWaitFor(2000);
    const imageBuffer = await page
      .goto(images[i], { waitUntil: "networkidle2" })
      .then((response) => response.buffer());
    const imageFileName = `image_${i + 1}.png`; // Можете изменить формат и имя файла
    const imagePath = `${DOWNLOAD_DIR}/${imageFileName}`;
    fs.writeFileSync(imagePath, imageBuffer);
  }
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(OUR_SITE);
  await page.setViewport({ width: 1080, height: 1024 });
  const searchResultSelector = ".pv-img";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  await page.waitForSelector("#qs-slideshow", { timeout: 100000 });

  await ownWaitFor(1000);

  let i = imagesCount;
  while (i > 0) {
    i--;
    await page.waitForSelector("#qs-slideshow-overlay-2b");
    await page.click("#qs-slideshow-overlay-2b");

    await page.waitForSelector("#qs-slideshow", { timeout: 2000 });

    await ownWaitFor(1000);
    let imagesFind = await findImages(page);
    imagesFind.forEach((img) => {
      if (img.src.length > 50) {
        uniqueImages.add(img.src);
      }
    });
  }
  uniqueImages.forEach((img) => images.push(img));

  await downloadImages(page);
  console.log("DONE");
  browser.close();
};

module.exports = { run };
