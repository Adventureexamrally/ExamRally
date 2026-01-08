const fs = require("fs");
const https = require("https");
const path = require("path");

const fonts = [
  {
    name: "NotoSansDevanagari",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansdevanagari/static/NotoSansDevanagari-Regular.ttf",
  },
  {
    name: "NotoSansTamil",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanstamil/static/NotoSansTamil-Regular.ttf",
  },
];

const downloadFont = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        downloadFont(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => resolve(Buffer.concat(data)));
      res.on("error", reject);
    });
  });
};

async function run() {
  let content = "export const fonts = {\n";
  for (const font of fonts) {
    console.log(`Downloading ${font.name}...`);
    try {
      const buffer = await downloadFont(font.url);
      const base64 = buffer.toString("base64");
      content += `  ${font.name}: '${base64}',\n`;
      console.log(`Success: ${font.name}`);
    } catch (err) {
      console.error(`Failed to download ${font.name}:`, err.message);
    }
  }
  content += "};\n";

  const targetPath = path.join(__dirname, "src", "utils", "fonts.js");
  fs.writeFileSync(targetPath, content);
  console.log(`Saved to ${targetPath}`);
}

run();
