#!/usr/bin/env node

const cwd = process.cwd();
const resolve = require("path").resolve;
const fs = require("fs/promises");
const argv = process.argv.splice(2);

const { bike, loadArgs } = require("bike");

const conf = loadArgs(argv);
conf.entry = resolve(cwd, "node_modules", ".bkie-tdd.runtime.ts");

let isHotFile = false;
let test = "(.test|.spec|_test|_spec)";
argv.forEach((item) => {
  if (/--hot/.test(item)) {
    isHotFile = true;
  }
  if (/--test/.test(item)) {
    test = true;
  }
});

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
  if (!createdCoded || isHotFile) {
    await createCode();
    createdCoded = true;
  }
}

bike({ ...conf, before });
