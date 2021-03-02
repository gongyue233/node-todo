const db = require("../db.js");
const fs = require("fs"); //这个时候还是真的fs
jest.mock("fs"); //这一句代表jest接管了fs,（）里面是指模块名

describe("db", () => {
  afterEach(()=>{
    fs.clearMocks()
  });
  it("can read", async () => {
    const data = [{ title: "hello", done: "false" }];
    fs.setMock("/xxx", null, JSON.stringify(data));
    const list = await db.read("/xxx");
    expect(list).toStrictEqual(data); //对比对象是用toStrictEqual不用toEqual，前者更严格
  });
  it("can write", async () => {
    let fakeFile = "";
    fs.setWriteMock("/yyy", (path, data, callback) => {
      //报错1：没有callback，因为db里的write的fs.writeFile有回调callback，所以这里没有的话会一直等
      fakeFile = data;
      callback(null); //callback(null)——表示没有错误
    });
    const list = [
      { title: "放屁", done: "false" },
      { title: "滚蛋", done: "true" },
    ];
    await db.write(list, "/yyy");
    //由于yyy进行了mock，根本就不会写到真正的/yyy里，而是直接写到变量里
    expect(fakeFile).toBe(JSON.stringify(list) + "\n"); //报错2：原来的db为了美观加了回车
  });
});
