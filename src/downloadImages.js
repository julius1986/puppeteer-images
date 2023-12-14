const fs = require("fs");
const path = require("path");
const { DOWNLOAD_DIR } = require("./constants");

const downloadImages = async (page, uniqueImages) => {
  let totalDownloadedmages = 0;
  for (const img of uniqueImages.keys()) {
    const result = await page.goto(img, { waitUntil: "networkidle2" });
    const imageBuffer = await result.buffer();
    const imageFileName = `image_${totalDownloadedmages + 1}.png`;
    const imagePath = `${DOWNLOAD_DIR}/${imageFileName}`;
    fs.writeFileSync(imagePath, imageBuffer);
    totalDownloadedmages++;
  }
  return totalDownloadedmages;
};

module.exports = downloadImages;
