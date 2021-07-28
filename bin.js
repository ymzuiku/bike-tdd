#!/usr/bin/env node

const cwd = process.cwd();
const resolve = require("path").resolve;
const fs = require("fs/promises");
const c8 = require("./c8");
const argv = process.argv.splice(2);
const { bike, loadArgs } = require("bike");

const conf = loadArgs(argv, true);
conf.entry = resolve(cwd, "node_modules", ".bkie-tdd.runtime.ts");
if (!conf.isWatch) {
  conf.once = true;
}

conf.isHotFile = false;
conf.cover = undefined;
conf.port = "3800";
conf.test = "(.test|.spec|_test|_spec)";
argv.forEach((item) => {
  if (/-r/.test(item)) {
    conf.cover = item.split("=")[1];
  }
  if (/--hot/.test(item)) {
    conf.isHotFile = true;
  }
  if (/--test/.test(item)) {
    conf.test = item.split("=")[1];
  }
  if (/--port/.test(item)) {
    conf.port = item.split("=")[1];
  }
});

if (conf.cover) {
  conf.isWatch = false;
  conf.once = true;
  c8(conf);
  return;
}

const files = [];
let waitGroup = 0;

function findTests(dir) {
  waitGroup += 1;
  fs.readdir(dir).then((list) => {
    list.forEach((file) => {
      waitGroup += 1;
      const p = resolve(dir, file);
      fs.stat(p).then((stat) => {
        if (stat.isDirectory()) {
          findTests(p);
        } else if (/(\.test|\.spec|_test|_spec)/.test(file)) {
          files.push(p);
        }
        waitGroup -= 1;
      });
    });
    waitGroup -= 1;
  });
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
  if (!createdCoded || conf.isHotFile) {
    await createCode();
    createdCoded = true;
  }
}

async function after() {
  // console.log("bbbbbbbbbbbbbbb");
  // if (conf.cover) {
  //   c8(conf);
  // }
}

bike({ ...conf, before, after });
