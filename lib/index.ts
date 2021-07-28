const cache = {} as { [key: string]: Function };

function getLine() {
  // let err = new Error();
  // const strErr = err.stack!;
  // const strLineErr = strErr.split(/\r|\n/)[3];
  // const arrErrResult = strLineErr.match(/[^/|:|\\]{1,}/gi);
  // const temp = {} as any;
  // return {
  //   colNum: arrErrResult!.pop()!.replace(")", ""),
  //   lineNum: arrErrResult!.pop(),
  //   fileName: "/" + arrErrResult!.slice(1).join("/"),
  // };
  let obj = {} as any;
  Error.captureStackTrace(obj, getLine);
  return obj.stack;
}

const tdd = {
  core: {
    cache,
  },
  getLine,
  test: (name: string, fn: Function) => {
    cache[name] = fn;
    fn();
  },
  is: () => {},
  equer: () => {},
  unique: () => {},
  error: () => {},
  fail: () => {},
};

export { tdd };
