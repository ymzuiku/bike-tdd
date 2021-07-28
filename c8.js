const fs = require("fs-extra");
const path = require("path");

function c8(conf) {
  if (!fs.existsSync("./node_modules/.bin/c8")) {
    console.error("Ignore c8, please use like:");
    console.error("npm install c8 --save-dev");
    throw new Error("Exit");
  }

  const { spawn } = require("child_process");
  const ls = spawn("./node_modules/.bin/c8", [
    `-r=${conf.cover}`,
    "--check-coverage",
    "--lines",
    "100",
    "--per-file",
    "bike-tdd",
    conf.src,
    // "node",
    // conf.out + "/index.js",
  ]);

  ls.stdout.on("data", (data) => {
    console.log(`${data}`);
  });

  ls.stderr.on("data", (data) => {
    console.error(`${data}`);
  });

  ls.on("close", (code) => {
    if (conf.cover === "html") {
      console.log(`Builded cover html:`);
      console.log(`${path.resolve(process.cwd(), "coverage")}/index.html`);
    }
  });
}

module.exports = c8;
