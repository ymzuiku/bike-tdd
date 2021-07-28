const fs = require("fs-extra");

let isStatied = false;

function c8(conf) {
  const { spawn } = require("child_process");
  if (!fs.existsSync("./node_modules/.bin/c8")) {
    console.error("Ignore c8, please use like:");
    console.error("npm install c8 --save-dev");
    throw new Error("Exit");
  }
  const ls = spawn("./node_modules/.bin/c8", [
    `-r=${conf.cover}`,
    "--check-coverage",
    "--lines",
    "100",
    "--per-file",
    "bike-tdd",
    conf.src,
  ]);

  ls.stdout.on("data", (data) => {
    console.log(`${data}`);
  });

  ls.stderr.on("data", (data) => {
    console.error(`${data}`);
  });

  ls.on("close", (code) => {
    console.log(`cover: http://127.0.0.1:${conf.port}`);
  });

  if (!isStatied && conf.cover === "html") {
    isStatied = true;
    const fastify = require("fastify")({ logger: false });
    const path = require("path");
    fastify.register(require("fastify-static"), {
      root: path.resolve(process.cwd(), "coverage"),
      prefix: "/",
    });
    fastify.listen(conf.port);
  }
}

module.exports = c8;
