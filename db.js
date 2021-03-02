const homedir = require("os").homedir();
const home = process.env.HOME || homedir;
const fs = require("fs");
const p = require("path");
const dbPath = p.join(home, ".todo");

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: "a+" }, (error, data) => {
        if (error) {
          console.log("error返回之前");
          reject(error); //return 指如果有错误就不继续执行下面的直接返回
        } else {
          let list;
          try {
            list = JSON.parse(data.toString());
            console.log("list成功的");
          } catch (error2) {
            list = [];
            console.log("list是空数组");
          }
          resolve(list);
        }
      });
    });
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list);
      fs.writeFile(path, string + "\n", (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  },
};

module.exports = db;
