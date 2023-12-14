const {
  IMAGES_CONTAINER,
  NEXT_CLICK_ELEMENT,
  ITERATION_CLICKS,
} = require("./constants");
const uniqueImages = new Set();

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

const getImagesList = async (page) => {
  let i = ITERATION_CLICKS;
  while (i > 0) {
    i--;
    await page.waitForSelector(IMAGES_CONTAINER);

    let imagesFind = await findImages(page);
    imagesFind.forEach((img) => {
      if (img.src.length > 50) {
        uniqueImages.add(img.src);
      }
    });
    await page.waitForSelector(NEXT_CLICK_ELEMENT);
    await page.click(NEXT_CLICK_ELEMENT);
  }

  return uniqueImages;
};

module.exports = getImagesList;
