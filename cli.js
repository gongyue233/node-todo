#!/usr/bin/env node
const program = require('commander')
const api1 = require("./main.js");
const pkg = require('./package.json') //首先得到 package.json
//不能声明 命名成 package，因为这个词是保留字

program
  .version(pkg.version)

program
  .option("-x, --xxx", "what the x");

program
  .command("add <taskNames...>")
  .description("add a task")
  .action(function (taskNames) {
    const word = taskNames.join(" ");
    api1.add(word);
  });

program
  .command("clear")
  .description("clear all task")
  .action(function () {
    api1.clear();
  });
//program
//  .command("show")
//  .description("show all")
//  .action(function () {
//    api1.showAll();
//  });

if(process.argv.length ===2){
  api1.showAll()
}

program.parse(process.argv);
