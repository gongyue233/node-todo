const homedir = require("os").homedir();
const home = process.env.HOME || homedir;
const p = require("path");
const dbPath = p.join(home, ".todo");
const db = require("./db.js");

const inquirer = require("inquirer");

module.exports.add = async (title) => {
  const list = await db.read();
  list.push({ title: title, done: false });
  await db.write(list);
};
module.exports.clear = async () => {
  await db.write([]);
};
function taskAsDone(list, index) {
  list[index].done = true;
  db.write(list);
}
function taskAsUnDone(list, index) {
  list[index].done = false;
  db.write(list);
}
function updateTitle(list, index) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "新的标题", //这里还想放置一个旧的标题
      default: list[index].title, //这就是旧标题
    })
    .then((answers3) => {
      list[index].title = answers3.title; //新标题被赋给list2
      db.write(list);
    });
}
function removeTask(list, index) {
  console.log("remove");
  list.splice(index, 1);
  db.write(list);
}
function askForAction(list, index) {
  const actions = { taskAsDone, taskAsUnDone, updateTitle, removeTask }; //action函数都被分出来了，可以写表的
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "请选择操作",
        choices: [
          { name: "退出", value: "quit" },
          { name: "已完成", value: "taskAsDone" },
          { name: "未完成", value: "taskAsUnDone" },
          { name: "改标题", value: "updateTitle" },
          { name: "删除", value: "removeTask" },
          //为了用表，将remove改成removeTask来使用户的选择与表里的函数名对应
        ],
      },
    ])
    .then((answers) => {
      const action = actions[answers.action]; //看用户的action是否在表actions里
      //这里就证明需要将choices里的value改的和函数名一样
      action && action(list, index); //如果action存在就执行（正好四个函数传入的参数都是 list index)
    });
}
function createTasks(list) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "输入创建的任务标题",
    })
    .then((answer) => {
      list.push({
        title: answer.title,
        done: false,
      });
      db.write(list);
    });
}
function printTasks(list) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "index",
        message: "选择要操作的任务",
        choices: [
          { name: "退出", value: "-1" },
          ...list.map((task, index) => {
            //...只list2产生的那些选项
            return {
              name: `${task.done ? "[x]" : "[_]"} ${index + 1} - ${task.title}`,
              value: index.toString(),
            };
          }),
          { name: "+创建任务", value: "-2" },
        ], //value 写成字符串，经验。
      },
    ])
    .then((answers) => {
      const index = parseInt(answers.index); //将字符串改回数字进行比较
      if (index >= 0) {
        askForAction(list, index);
      } else if (index === -2) {
        createTasks(list);
      }
    });
}
module.exports.showAll = async (title) => {
  const list = await db.read();
  // printTasks
  printTasks(list);
};
