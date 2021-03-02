const fs = jest.createMockFromModule("fs"); //文档要求对于假的fs要先声明
const _fs = jest.requireActual("fs");
//jest.requireActual(moduleName)可以获得真正的module，这里就是获得了真 fs

Object.assign(fs, _fs); //将右边的所有都复制到左边

let readMocks = {}; //哈希表

fs.setMock = (path, error, data) => {
  readMocks[path] = [error, data];
};
fs.readFile = (path, options, callback) => {
  if (callback === undefined) {
    callback = options;
  }
  if (path in readMocks) {
    callback(readMocks[path][0], readMocks[path][1]);
    // 也可以写成 callback(...mocks[path])
  } else {
    _fs.readFile(path, options, callback);
  }
};
let writeMocks = {};
fs.setWriteMock = (path, fn) => {
  //造假,fn就是假的时候怎么做
  writeMocks[path] = fn;
};
fs.writeFile = (path, data, options, callback) => {
  if (callback === undefined) {
    callback = options;
  }
  if (path in writeMocks) {
    writeMocks[path](path, data, options, callback);
  } else {
    _fs.writeFile(path, data, options, callback); //不造假的时候调用真实的fs.writeFile
  }
};
fs.clearMocks = () => {
  writeMocks = {}, //清空mocks表
  readMocks = {};
};
module.exports = fs;
