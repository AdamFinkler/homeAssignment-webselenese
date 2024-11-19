const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

const main = async (url, depthIndex) => {
  const dom = await JSDOM.fromURL(url);

  visited[url] = true;

  const allImgTags = dom.window.document.querySelectorAll("img");

  allImgTags.forEach((img) => {
    const imgData = {
      imageUrl: img.src,
      sourceUrl: url,
      depth: depthIndex,
    };

    data.result.push(imgData);
  });

  const allAnchorTags = dom.window.document.querySelectorAll("a");

  const currentLinksInPage = [];

  allAnchorTags.forEach((subPage) => {
    const link = subPage.href;
    if (!visited[link]) {
      currentLinksInPage.push(subPage.href);
    }
  });

  if (currentLinksInPage.length && depthIndex + 1 <= depthProvided) {
    currentLinksInPage.forEach(async (link) => {
      try {
        await main(link, depthIndex + 1);
      } catch (e) {}
    });
  }

  fs.writeFile("results.json", JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("File successfully written to results.json!");
    }
  });
};

const data = {
  result: [],
};

const depthProvided = +process.argv[3];
const url = process.argv[2];

const visited = {};

main(url, 0);
