#!/usr/bin/env node

const cwd = process.cwd();
const resolve = require("path").resolve;
const fs = require("fs-extra");
const { bike, loadArgs } = require("bike");
const c8 = require("./c8");

const conf = loadArgs(process.argv, true);
conf.entry = resolve(conf.out, "bike-tdd.ts");
if (!conf.watch) {
  conf.start = true;
}

const files = [];
let waitGroup = 0;
const reg = new RegExp(conf.match);

function findTests(dir) {
  waitGroup += 1;
  fs.readdir(dir).then((list) => {
    list.forEach((file) => {
      waitGroup += 1;
      const p = resolve(dir, file);
      fs.stat(p).then((stat) => {
        if (stat.isDirectory()) {
          findTests(p);
        } else if (reg.test(file)) {
          files.push(p);
        }
        waitGroup -= 1;
      });
    });
    waitGroup -= 1;
  });
}

if (!fs.existsSync(conf.out)) {
  fs.mkdirpSync(conf.out);
}

async function createCode() {
  findTests(resolve(cwd, conf.src));
  await new Promise((res) => {
    const stop = setInterval(() => {
      if (waitGroup == 0) {
        clearInterval(stop);
        res();
      }
    });
  }, 20);
  const code = files.map((file) => `import "${file}";`).join("\n");
  await fs.writeFile(conf.entry, code);
}

let createdCoded = false;

async function before() {
  if (!createdCoded || conf.rematch) {
    await createCode();
    createdCoded = true;
  }
}

async function after() {
  if (conf.reporter) {
    c8(conf);
  }
}

bike({ ...conf, before, after });
